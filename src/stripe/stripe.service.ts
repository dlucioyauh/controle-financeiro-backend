import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';

@Injectable()
export class StripeService {
  private stripe: any;   // <-- usamos any para evitar conflitos de tipo

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) throw new Error('STRIPE_SECRET_KEY não configurado');
    this.stripe = new Stripe(secretKey, {
      // não definimos apiVersion explicitamente, usa a padrão da biblioteca
    });
  }

  async createCheckoutSession(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new Error('Usuário não encontrado');

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email || undefined,
        name: user.nome || user.username,
      });
      customerId = customer.id;
      await this.usersService.updatePerfil(userId, {
        stripeCustomerId: customerId,
      } as any);
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { priceId },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session.url;
  }

  async handleWebhookEvent(payload: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET não configurado');

    let event: any;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      const message = err?.message ?? 'Erro desconhecido';
      throw new Error(`Webhook signature verification failed: ${message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const priceId = session.metadata?.priceId;
        const plano = this.getPlanFromPriceId(priceId || '');
        await this.usersService.updateByStripeCustomer(customerId, {
          stripeSubscriptionId: subscriptionId,
          stripeSubscriptionStatus: 'active',
          plano,
        } as any);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        const updateData: any = {
          stripeSubscriptionStatus: subscription.status,
        };
        if (
          subscription.status === 'canceled' ||
          subscription.status === 'unpaid'
        ) {
          updateData.plano = 'free';
        }
        await this.usersService.updateByStripeCustomer(customerId, updateData);
        break;
      }
    }
  }

  private getPlanFromPriceId(priceId: string): string {
    const mapping: Record<string, string> = {
      [this.configService.get<string>('STRIPE_PRICE_BASIC') || '']: 'basic',
      [this.configService.get<string>('STRIPE_PRICE_PRO') || '']: 'pro',
      [this.configService.get<string>('STRIPE_PRICE_PREMIUM') || '']: 'premium',
    };
    return mapping[priceId] || 'free';
  }

  async createPortalSession(customerId: string) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: frontendUrl + '/app/configuracoes',
    });
    return session.url;
  }
}