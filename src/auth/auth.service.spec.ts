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

  it('deve registrar um usuário e retornar token', async () => {
    (usersService.create as jest.Mock).mockResolvedValue({ id: '1', username: 'teste', email: 'teste@teste.com' });
    const result = await service.register({ username: 'teste', password: '123456' });
    expect(result).toHaveProperty('access_token');
  });

  it('deve validar senha no login', async () => {
    const hash = await bcrypt.hash('123456', 10);
    (usersService.findOne as jest.Mock).mockResolvedValue({ id: '1', username: 'teste', password: hash });
    const result = await service.signIn('teste', '123456');
    expect(result).toHaveProperty('access_token');
  });

  it('deve lançar erro se senha incorreta', async () => {
    const hash = await bcrypt.hash('123456', 10);
    (usersService.findOne as jest.Mock).mockResolvedValue({ id: '1', username: 'teste', password: hash });
    await expect(service.signIn('teste', 'senha_errada')).rejects.toThrow();
  });
});