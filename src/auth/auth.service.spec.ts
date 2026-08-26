import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let mailService: Partial<MailService>;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn(),
      create: jest.fn(),
      updatePerfil: jest.fn(),
      findByEmail: jest.fn(),
      findByResetToken: jest.fn(),
    };

    mailService = {
      sendWelcomeEmail: jest.fn(),
      sendPasswordReset: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    configService = {
      get: jest.fn((key: string) => {
        if (key === 'FRONTEND_URL') return 'http://localhost:5173';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: MailService, useValue: mailService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService }, // ✅ CORREÇÃO AQUI
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar um usuário e retornar token', async () => {
      const userData = { username: 'testuser', password: 'password123', email: 'test@test.com' };
      const createdUser = { id: '1', ...userData, plano: 'free' };
      
      (usersService.create as jest.Mock).mockResolvedValue(createdUser);
      (usersService.updatePerfil as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.register(userData);

      expect(usersService.create).toHaveBeenCalledWith(userData);
      expect(usersService.updatePerfil).toHaveBeenCalled();
      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
    });

    it('deve iniciar o trial de 7 dias ao registrar usuário free', async () => {
      const userData = { username: 'testuser', password: 'password123' };
      const createdUser = { id: '1', ...userData, plano: 'free' };
      
      (usersService.create as jest.Mock).mockResolvedValue(createdUser);
      (usersService.updatePerfil as jest.Mock).mockResolvedValue(createdUser);

      await service.register(userData);

      expect(usersService.updatePerfil).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ trialEndsAt: expect.any(Date) })
      );
    });

    it('NÃO deve quebrar o registro se o envio de e‑mail falhar', async () => {
      const userData = { username: 'testuser', password: 'password123', email: 'test@test.com' };
      const createdUser = { id: '1', ...userData, plano: 'free' };
      
      (usersService.create as jest.Mock).mockResolvedValue(createdUser);
      (usersService.updatePerfil as jest.Mock).mockResolvedValue(createdUser);
      (mailService.sendWelcomeEmail as jest.Mock).mockRejectedValue(new Error('SMTP error'));

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await service.register(userData);

      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });

    it('deve notificar o dono (dlucio) sobre novo cadastro', async () => {
      const userData = { username: 'testuser', password: 'password123', email: 'test@test.com' };
      const createdUser = { id: '1', ...userData, plano: 'free' };
      
      (usersService.create as jest.Mock).mockResolvedValue(createdUser);
      (usersService.updatePerfil as jest.Mock).mockResolvedValue(createdUser);

      await service.register(userData);

      expect(mailService.sendWelcomeEmail).toHaveBeenCalledWith(
        'dlucio.douglas@gmail.com',
        expect.stringContaining('Novo cadastro: testuser')
      );
    });
  });

  describe('signIn', () => {
    it('deve validar senha no login', async () => {
      const user = { id: '1', username: 'testuser', password: 'hashed_password' };
      (usersService.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.signIn('testuser', 'password123');

      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
    });

    it('deve lançar erro se senha incorreta', async () => {
      const user = { id: '1', username: 'testuser', password: 'hashed_password' };
      (usersService.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn('testuser', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('deve lançar erro se usuário não existe', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.signIn('nonexistent', 'password123')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('deve permitir login mesmo após trial expirado (a restrição é via guard)', async () => {
      const user = { 
        id: '1', 
        username: 'testuser', 
        password: 'hashed_password',
        trialEndsAt: new Date('2020-01-01')
      };
      (usersService.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.signIn('testuser', 'password123');

      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
    });
  });
});