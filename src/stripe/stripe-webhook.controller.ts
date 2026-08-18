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
    // Lê o corpo bruto da requisição (chunks)
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.from(chunk));
    }
    const rawBody = Buffer.concat(chunks);

    if (rawBody.length === 0) {
      throw new Error('No webhook payload was provided.');
    }

    await this.stripeService.handleWebhookEvent(rawBody, signature);
    return { received: true };
  }
}