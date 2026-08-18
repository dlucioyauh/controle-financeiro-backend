import { Controller, Post, Req, Headers } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeWebhookController {
  constructor(private stripeService: StripeService) {}

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
  ) {
    // Garante que o payload bruto seja um Buffer
    let payload: Buffer;

    if (req.rawBody) {
      payload = req.rawBody;
    } else if (req.body) {
      // Se req.body for um objeto, tenta converter para string
      payload = Buffer.from(JSON.stringify(req.body));
    } else {
      throw new Error('No webhook payload was provided.');
    }

    await this.stripeService.handleWebhookEvent(payload, signature);
    return { received: true };
  }
}