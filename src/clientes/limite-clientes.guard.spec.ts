import { LimiteClientesGuard } from './limite-clientes.guard';
import { UsersService } from '../users/users.service';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

describe('LimiteClientesGuard', () => {
  let guard: LimiteClientesGuard;
  let usersService: Partial<UsersService>;
  let clienteRepo: Partial<Repository<Customer>>;

  beforeEach(() => {
    usersService = { findOne: jest.fn() };
    clienteRepo = { count: jest.fn() };
    guard = new LimiteClientesGuard(
      usersService as UsersService,
      clienteRepo as Repository<Customer>,
    );
  });

  function mockContext(username: string): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user: { username } }),
      }),
      getHandler: () => {},
    } as unknown as ExecutionContext;
  }

  it('deve permitir criação se abaixo do limite (free: 10)', async () => {
    (usersService.findOne as jest.Mock).mockResolvedValue({ plano: 'free' });
    (clienteRepo.count as jest.Mock).mockResolvedValue(9);
    const ctx = mockContext('teste');
    expect(await guard.canActivate(ctx)).toBe(true);
  });

  it('deve bloquear criação se atingiu o limite (free: 10)', async () => {
    (usersService.findOne as jest.Mock).mockResolvedValue({ plano: 'free' });
    (clienteRepo.count as jest.Mock).mockResolvedValue(10);
    const ctx = mockContext('teste');
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('deve permitir criação ilimitada para pro', async () => {
    (usersService.findOne as jest.Mock).mockResolvedValue({ plano: 'pro' });
    // count não deve ser chamado para planos ilimitados, mas se for, retorna 999
    (clienteRepo.count as jest.Mock).mockResolvedValue(999);
    const ctx = mockContext('pro');
    expect(await guard.canActivate(ctx)).toBe(true);
  });
});