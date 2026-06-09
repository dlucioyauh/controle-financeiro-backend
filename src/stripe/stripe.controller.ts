import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('stripe')
@UseGuards(AuthGuard)
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckout(@Body() body: { priceId: string }, @Req() req: Request) {
    const userId = (req as any).user?.userId;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const successUrl = frontendUrl + '/app/configuracoes?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = frontendUrl + '/app/configuracoes';
    const url = await this.stripeService.createCheckoutSession(userId, body.priceId, successUrl, cancelUrl);
    return { url };
  }

  @Get('portal')
  async portal(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    const user = await (this.stripeService as any).usersService.findById(userId); // acessaremos o usersService
    if (!user?.stripeCustomerId) throw new Error('Cliente Stripe não encontrado');
    const url = await this.stripeService.createPortalSession(user.stripeCustomerId);
    return { url };
  }
}