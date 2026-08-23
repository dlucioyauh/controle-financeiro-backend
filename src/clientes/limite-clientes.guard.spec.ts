import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { LimiteClientesGuard } from './limite-clientes.guard';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './customer.entity';

describe('LimiteClientesGuard', () => {
  let guard: LimiteClientesGuard;
  let usersService: Partial<UsersService>;
  let clienteRepo: any;

  beforeEach(async () => {
    usersService = {
      findById: jest.fn(),
    };
    clienteRepo = {
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LimiteClientesGuard,
        { provide: UsersService, useValue: usersService },
        { provide: getRepositoryToken(Customer), useValue: clienteRepo },
      ],
    }).compile();

    guard = module.get<LimiteClientesGuard>(LimiteClientesGuard);
  });

  // Helper para criar o mock do contexto com o user injetado corretamente
  const mockContext = (userId: string = 'user-123') => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId, username: 'teste' },
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('deve bloquear criação se atingiu o limite (free: 10)', async () => {
    (usersService.findById as jest.Mock).mockResolvedValue({ plano: 'free' });
    (clienteRepo.count as jest.Mock).mockResolvedValue(10);
    
    const ctx = mockContext('user-123');
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('deve permitir criação ilimitada para pro', async () => {
    (usersService.findById as jest.Mock).mockResolvedValue({ plano: 'pro' });
    
    const ctx = mockContext('user-123');
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it('deve permitir se o usuário não tiver userId (delega ao AuthGuard)', async () => {
    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({}), // Sem user
      }),
    } as unknown as ExecutionContext;
    
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });
});