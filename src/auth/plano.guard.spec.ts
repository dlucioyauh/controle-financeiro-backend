import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PlanoGuard } from './plano.guard';
import { UsersService } from '../users/users.service';
import { Reflector } from '@nestjs/core';

describe('PlanoGuard', () => {
  let guard: PlanoGuard;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanoGuard,
        { provide: UsersService, useValue: usersService },
        { provide: Reflector, useValue: {} },
      ],
    }).compile();

    guard = module.get<PlanoGuard>(PlanoGuard);
  });

  it('deve ser definido', () => {
    expect(guard).toBeDefined();
  });

  it('deve lançar ForbiddenException se o usuário não estiver autenticado', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}), // Sem propriedade user
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deve permitir acesso se o usuário tem plano Pro', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId: 'mock-user-id', username: 'mock-user' },
        }),
      }),
    } as unknown as ExecutionContext;

    (usersService.findById as jest.Mock).mockResolvedValue({
      id: 'mock-user-id',
      plano: 'pro',
    });

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('deve permitir acesso se o usuário tem plano Premium', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId: 'mock-user-id', username: 'mock-user' },
        }),
      }),
    } as unknown as ExecutionContext;

    (usersService.findById as jest.Mock).mockResolvedValue({
      id: 'mock-user-id',
      plano: 'premium',
    });

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('deve lançar ForbiddenException se o usuário tem plano Free', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId: 'mock-user-id', username: 'mock-user' },
        }),
      }),
    } as unknown as ExecutionContext;

    (usersService.findById as jest.Mock).mockResolvedValue({
      id: 'mock-user-id',
      plano: 'free',
    });

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      ForbiddenException,
    );
  });
});