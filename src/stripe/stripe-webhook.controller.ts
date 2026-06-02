import { Controller, Post, Req, Headers } from '@nestjs/common';
import { StripeService } from './stripe.service';
import type { Request } from 'express';

@Controller('stripe')
export class StripeWebhookController {
  constructor(private stripeService: StripeService) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody || !signature) return { received: false };
    await this.stripeService.handleWebhookEvent(rawBody, signature);
    return { received: true };
  }
}