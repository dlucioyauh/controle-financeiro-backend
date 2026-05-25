import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, nome?: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Bem-vindo ao Controle Financeiro 🚀',
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h1>Bem-vindo${nome ? `, ${nome}` : ''}!</h1>

          <p>
            Seu cadastro foi realizado com sucesso.
          </p>

          <p>
            Agora você já pode acessar sua plataforma financeira.
          </p>

          <br />

          <strong>Equipe IonKod</strong>
        </div>
      `,
    });
  }
}