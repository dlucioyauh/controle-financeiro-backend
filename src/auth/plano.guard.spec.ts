import { PlanoGuard } from './plano.guard';
import { UsersService } from '../users/users.service';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('PlanoGuard', () => {
  let guard: PlanoGuard;
  let usersService: Partial<UsersService>;
  let reflector: Partial<Reflector>;

  beforeEach(() => {
    usersService = { findOne: jest.fn() };
    reflector = { get: jest.fn() };
    guard = new PlanoGuard(reflector as Reflector, usersService as UsersService);
  });

  function mockContext(user: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => {},
    } as unknown as ExecutionContext;
  }

  it('deve permitir acesso se o usuário tem plano igual ou superior', async () => {
    (reflector.get as jest.Mock).mockReturnValue('basic');
    (usersService.findOne as jest.Mock).mockResolvedValue({ plano: 'pro' });
    const ctx = mockContext({ username: 'teste' });
    expect(await guard.canActivate(ctx)).toBe(true);
  });

  it('deve negar acesso se o plano é inferior ao exigido', async () => {
    (reflector.get as jest.Mock).mockReturnValue('pro');
    (usersService.findOne as jest.Mock).mockResolvedValue({ plano: 'free' });
    const ctx = mockContext({ username: 'teste' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('deve negar acesso se o trial expirou (plano free + data passada)', async () => {
    (reflector.get as jest.Mock).mockReturnValue('basic');
    (usersService.findOne as jest.Mock).mockResolvedValue({
      plano: 'free',
      trialEndsAt: new Date('2020-01-01'),
    });
    const ctx = mockContext({ username: 'teste' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('deve permitir acesso se o trial ainda é válido (plano free)', async () => {
    (reflector.get as jest.Mock).mockReturnValue('basic');
    const futuro = new Date();
    futuro.setDate(futuro.getDate() + 3);
    (usersService.findOne as jest.Mock).mockResolvedValue({
      plano: 'free',
      trialEndsAt: futuro,
    });
    const ctx = mockContext({ username: 'teste' });
    expect(await guard.canActivate(ctx)).toBe(true);
  });

  it('deve permitir acesso se não houver exigência de plano', async () => {
    (reflector.get as jest.Mock).mockReturnValue(undefined);
    (usersService.findOne as jest.Mock).mockResolvedValue({ plano: 'free' });
    const ctx = mockContext({ username: 'teste' });
    expect(await guard.canActivate(ctx)).toBe(true);
  });
});