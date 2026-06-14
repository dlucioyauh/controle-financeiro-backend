import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

describe('StripeService - getPlanFromPriceId', () => {
  let service: StripeService;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    configService = {
      get: jest.fn((key: string) => {
        const mapping: Record<string, string> = {
          STRIPE_SECRET_KEY: 'sk_test_fake',
          STRIPE_PRICE_BASIC: 'price_basic',
          STRIPE_PRICE_PRO: 'price_pro',
          STRIPE_PRICE_PREMIUM: 'price_premium',
        };
        return mapping[key] || null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        { provide: UsersService, useValue: {} },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  it('deve retornar "basic" para o price ID do plano Basic', () => {
    // Acessamos o método privado via bracket notation para teste
    const result = (service as any).getPlanFromPriceId('price_basic');
    expect(result).toBe('basic');
  });

  it('deve retornar "pro" para o price ID do plano Pro', () => {
    const result = (service as any).getPlanFromPriceId('price_pro');
    expect(result).toBe('pro');
  });

  it('deve retornar "premium" para o price ID do plano Premium', () => {
    const result = (service as any).getPlanFromPriceId('price_premium');
    expect(result).toBe('premium');
  });

  it('deve retornar "free" para price ID desconhecido', () => {
    const result = (service as any).getPlanFromPriceId('price_inexistente');
    expect(result).toBe('free');
  });
});