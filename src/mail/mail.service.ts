import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private apiKey: string;
  private from: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get('RESEND_API_KEY')!;
    this.from = this.config.get('MAIL_FROM')!;
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!to) {
      throw new Error('Destinatário inválido');
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.from,
        to,
        subject,
        html,
      }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao enviar e-mail: ${error}`);
    }
    return response;
  }

  async sendWelcomeEmail(to: string, name: string) {
    const nomeExibicao = name || 'usuário';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Bem-vindo, ${nomeExibicao}!</h1>
        <p>Seu cadastro foi realizado com sucesso.</p>
        <p>Agora você já pode acessar sua plataforma financeira e gerenciar suas receitas, despesas e muito mais.</p>
        <br />
        <p><strong>Equipe IonFinance</strong></p>
      </div>
    `;
    await this.sendEmail(to, `Bem-vindo ao IonFinance, ${nomeExibicao}! 🚀`, html);
  }
}