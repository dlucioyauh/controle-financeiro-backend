import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private apiKey: string;
  private from: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get('RESEND_API_KEY') || '';
    // IMPORTANTE: Este e-mail DEVE estar verificado no painel do Resend (DNS no Cloudflare)
    this.from = this.config.get('MAIL_FROM') || 'contato@ionfinance.com.br';

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
    const nomeExibicao = name ? name.split(' ')[0] : 'usuário';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #020617; color: #e2e8f0;">
        <h1 style="color: #22d3ee;">Bem-vindo, ${nomeExibicao}!</h1>
        <p>Seu cadastro no IonFinance foi realizado com sucesso.</p>
        <p>Agora você já pode acessar sua plataforma e gerenciar suas finanças com a tecnologia IONKOD.</p>
        <br />
        <p><strong>Equipe IonFinance</strong></p>
      </div>
    `;
    await this.sendEmail(to, `Bem-vindo ao IonFinance, ${nomeExibicao}! 🚀`, html);
  }

  async sendSubscriptionConfirmation(to: string, name: string, plano: string, valor?: string) {
    const nomeExibicao = name ? name.split(' ')[0] : 'usuário';
    const valorFormatado = valor ? `no valor de ${valor}` : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Assinatura Confirmada - IonFinance</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #020617; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e2e8f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020617; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden;">
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px 20px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">IonFinance</h1>
                    <p style="color: #cffafe; margin: 8px 0 0 0; font-size: 14px; font-weight: 500;">by IONKOD</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 20px;">Olá, ${nomeExibicao}! 🚀</h2>
                    <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Sua assinatura foi confirmada com sucesso! Agora você está no controle total das suas finanças com o plano <strong style="color: #22d3ee;">${plano}</strong> ${valorFormatado}.
                    </p>
                    <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Todos os recursos do seu novo plano já estão liberados no seu painel.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="https://ionfinance.com.br/login" style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">
                            Acessar Meu Painel
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #020617; padding: 20px 30px; border-top: 1px solid #1e293b; text-align: center;">
                    <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">
                      Precisa de ajuda? Responda este e-mail ou fale conosco pelo <a href="https://wa.me/5548996126202" style="color: #22d3ee; text-decoration: none;">WhatsApp</a>.
                    </p>
                    <p style="color: #475569; font-size: 11px; margin: 0;">
                      © ${new Date().getFullYear()} IONKOD. Todos os direitos reservados.<br>
                      IonFinance - Tecnologia inteligente para o seu negócio.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    await this.sendEmail(to, `Assinatura do plano ${plano} confirmada! 🎉`, html);
  }

  async sendSetupConfirmation(to: string, name: string) {
    const nomeExibicao = name ? name.split(' ')[0] : 'usuário';
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #020617; font-family: Arial, sans-serif; color: #e2e8f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020617; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px 20px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">IonFinance</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #ffffff; margin: 0 0 20px 0;">Olá, ${nomeExibicao}! 🚀</h2>
                    <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
                      Recebemos o pagamento do seu <strong style="color: #22d3ee;">Setup Inicial</strong>.
                    </p>
                    <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-top: 15px;">
                      Em breve nossa equipe entrará em contato para configurar seus produtos, receitas e clientes, além de agendar seu treinamento personalizado.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #020617; padding: 20px 30px; border-top: 1px solid #1e293b; text-align: center;">
                    <p style="color: #475569; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} IONKOD. Todos os direitos reservados.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    await this.sendEmail(to, 'Setup Inicial confirmado! 🚀', html);
  }

  // ✅ NOVO: E-mail de Recuperação de Senha (Com o mesmo padrão visual IONKOD)
  async sendPasswordReset(to: string, name: string, resetUrl: string) {
    const nomeExibicao = name ? name.split(' ')[0] : 'usuário';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha - IonFinance</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #020617; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e2e8f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020617; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden;">
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px 20px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">IonFinance</h1>
                    <p style="color: #cffafe; margin: 8px 0 0 0; font-size: 14px;">by IONKOD</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 20px;">Olá, ${nomeExibicao}!</h2>
                    <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Recebemos uma solicitação para redefinir sua senha no IonFinance.
                    </p>
                    <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Para sua segurança, este link é válido por apenas <strong style="color: #22d3ee;">15 minutos</strong>.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display: inline-block; background-color: #0891b2; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">
                            Redefinir Minha Senha
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                      Se você não solicitou esta alteração, pode ignorar este e-mail com segurança. Sua senha permanecerá inalterada.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #020617; padding: 20px 30px; border-top: 1px solid #1e293b; text-align: center;">
                    <p style="color: #475569; font-size: 11px; margin: 0;">
                      © ${new Date().getFullYear()} IONKOD. Todos os direitos reservados.<br>
                      IonFinance - Tecnologia inteligente para o seu negócio.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    await this.sendEmail(to, 'Redefinição de Senha - IonFinance 🔒', html);
  }
}