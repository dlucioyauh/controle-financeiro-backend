import { Controller, Post, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private configService: ConfigService,
  ) {}

  @Post('checkout')
  @UseGuards(AuthGuard)
  async createCheckout(@Req() req, @Body('priceId') priceId: string) {
    try {
      const userId = req.user.userId;
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
      const url = await this.stripeService.createCheckoutSession(
        userId,
        priceId,
        `${frontendUrl}/app/configuracoes?checkout=success`,
        `${frontendUrl}/app/configuracoes?checkout=cancel`,
      );
      return { url };
    } catch (err: any) {
      throw new BadRequestException(`Erro ao criar checkout: ${err.message}`);
    }
  }

  @Post('setup-checkout')
  @UseGuards(AuthGuard)
  async createSetupCheckout(@Req() req, @Body('priceId') priceId: string) {
    try {
      const userId = req.user.userId;
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
      const url = await this.stripeService.createSetupCheckoutSession(
        userId,
        priceId,
        `${frontendUrl}/app/configuracoes?setup=success`,
        `${frontendUrl}/app/configuracoes?setup=cancel`,
      );
      return { url };
    } catch (err: any) {
      throw new BadRequestException(`Erro ao criar checkout de setup: ${err.message}`);
    }
  }

  @Post('portal')
  @UseGuards(AuthGuard)
  async createPortal(@Req() req) {
    try {
      const customerId = req.user.stripeCustomerId;
      if (!customerId) return { url: null };
      const url = await this.stripeService.createPortalSession(customerId);
      return { url };
    } catch (err: any) {
      throw new BadRequestException(`Erro ao abrir portal: ${err.message}`);
    }
  }
}