import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private apiKey: string;
  private from: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get('RESEND_API_KEY') || '';
    this.from = this.config.get('MAIL_FROM') || 'onboarding@resend.dev';

    if (!this.apiKey) {
      this.logger.warn('RESEND_API_KEY não configurada. E-mails não serão enviados.');
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!to) {
      throw new Error('Destinatário inválido');
    }

    this.logger.log(`📧 Enviando e-mail para ${to} com assunto "${subject}"`);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
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
      this.logger.error(`❌ Erro ao enviar e-mail: ${error}`);
      throw new Error(`Erro ao enviar e-mail: ${error}`);
    }

    this.logger.log(`✅ E-mail enviado com sucesso para ${to}`);
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

  async sendSubscriptionConfirmation(to: string, name: string, plano: string) {
    const nomeExibicao = name || 'usuário';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Assinatura confirmada!</h1>
        <p>Olá, ${nomeExibicao}.</p>
        <p>Você assinou o plano <strong>${plano}</strong> com sucesso.</p>
        <p>Agora você tem acesso a todos os recursos do seu plano.</p>
        <br />
        <p><strong>Equipe IonFinance</strong></p>
      </div>
    `;
    await this.sendEmail(to, `Assinatura ${plano} confirmada! 🎉`, html);
  }

  async sendSetupConfirmation(to: string, name: string) {
    const nomeExibicao = name || 'usuário';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Setup Inicial confirmado!</h1>
        <p>Olá, ${nomeExibicao}.</p>
        <p>Recebemos o pagamento do Setup Inicial.</p>
        <p>Em breve nossa equipe entrará em contato para configurar seus produtos, receitas e clientes, além de agendar o treinamento.</p>
        <br />
        <p><strong>Equipe IonFinance</strong></p>
      </div>
    `;
    await this.sendEmail(to, 'Setup Inicial confirmado! 🚀', html);
  }
}