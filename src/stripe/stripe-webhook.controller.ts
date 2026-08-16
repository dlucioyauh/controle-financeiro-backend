import { Controller, Post, Req, Headers } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeWebhookController {
  constructor(private stripeService: StripeService) {}

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any, // use any para evitar problema de tipagem
  ) {
    const payload = req.rawBody as Buffer;
    await this.stripeService.handleWebhookEvent(payload, signature);
    return { received: true };
  }
}