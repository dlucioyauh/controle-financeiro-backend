import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service.js';
import { StripeController } from './stripe.controller.js';
import { StripeWebhookController } from './stripe-webhook.controller.js';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [StripeService],
  controllers: [StripeController, StripeWebhookController],
  exports: [StripeService],
})
export class StripeModule {}