import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let mailService: Partial<MailService>;

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn(),
      create: jest.fn(),
      updatePerfil: jest.fn(),   // ← novo mock
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('token_fake'),
      sign: jest.fn().mockReturnValue('token_fake'),
    };
    mailService = {
      sendWelcomeEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // ─── Testes de REGISTRO ────────────────────────

  it('deve registrar um usuário e retornar token', async () => {
    (usersService.create as jest.Mock).mockResolvedValue({
      id: '1',
      username: 'teste',
      email: 'teste@teste.com',
      plano: 'free',
    });
    const result = await service.register({ username: 'teste', password: '123456' });
    expect(result).toHaveProperty('access_token');
  });

  it('deve iniciar o trial de 7 dias ao registrar usuário free', async () => {
    const fakeUser = {
      id: '2',
      username: 'novo',
      email: 'novo@teste.com',
      plano: 'free',
    };
    (usersService.create as jest.Mock).mockResolvedValue(fakeUser);
    await service.register({ username: 'novo', password: '123456' });

    // Verifica se updatePerfil foi chamado com um trialEndsAt definido
    expect(usersService.updatePerfil).toHaveBeenCalledWith(
      '2',
      expect.objectContaining({
        trialEndsAt: expect.any(Date),
      }),
    );
  });

  it('NÃO deve quebrar o registro se o envio de e‑mail falhar', async () => {
    const fakeUser = {
      id: '3',
      username: 'sememail',
      email: 'sememail@teste.com',
      plano: 'free',
    };
    (usersService.create as jest.Mock).mockResolvedValue(fakeUser);
    // Simula um erro no envio de e‑mail
    (mailService.sendWelcomeEmail as jest.Mock).mockRejectedValue(new Error('SMTP error'));

    const result = await service.register({ username: 'sememail', password: '123456' });
    expect(result).toHaveProperty('access_token');
    // O e‑mail foi tentado, mesmo falhando
    expect(mailService.sendWelcomeEmail).toHaveBeenCalled();
  });

  it('deve notificar o dono (dlucio) sobre novo cadastro', async () => {
    const fakeUser = {
      id: '4',
      username: 'notifica',
      email: 'notifica@teste.com',
      plano: 'free',
    };
    (usersService.create as jest.Mock).mockResolvedValue(fakeUser);
    await service.register({ username: 'notifica', password: '123456' });

    // Verifica se o e‑mail para o dono foi chamado
    expect(mailService.sendWelcomeEmail).toHaveBeenCalledWith(
      'dlucio.douglas@gmail.com',
      expect.stringContaining('notifica'),
    );
  });

  // ─── Testes de LOGIN ──────────────────────────

  it('deve validar senha no login', async () => {
    const hash = await bcrypt.hash('123456', 10);
    (usersService.findOne as jest.Mock).mockResolvedValue({
      id: '1',
      username: 'teste',
      password: hash,
    });
    const result = await service.signIn('teste', '123456');
    expect(result).toHaveProperty('access_token');
  });

  it('deve lançar erro se senha incorreta', async () => {
    const hash = await bcrypt.hash('123456', 10);
    (usersService.findOne as jest.Mock).mockResolvedValue({
      id: '1',
      username: 'teste',
      password: hash,
    });
    await expect(service.signIn('teste', 'senha_errada')).rejects.toThrow();
  });

  it('deve lançar erro se usuário não existe', async () => {
    (usersService.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.signIn('fantasma', '123456')).rejects.toThrow();
  });

  // ─── Teste de LOGIN com trial expirado (comportamento futuro) ──
  it('deve permitir login mesmo após trial expirado (a restrição é via guard)', async () => {
    const hash = await bcrypt.hash('123456', 10);
    (usersService.findOne as jest.Mock).mockResolvedValue({
      id: '5',
      username: 'expirado',
      password: hash,
      plano: 'free',
      trialEndsAt: new Date('2020-01-01'), // data passada
    });
    const result = await service.signIn('expirado', '123456');
    expect(result).toHaveProperty('access_token');
  });
});