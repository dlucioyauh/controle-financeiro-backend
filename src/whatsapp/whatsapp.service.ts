import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly instance: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || '';
    this.apiKey = process.env.WHATSAPP_API_KEY || '';
    this.instance = process.env.WHATSAPP_INSTANCE || '';

    this.logger.log(
      `WhatsAppService inicializado | apiUrl=${this.apiUrl} | instance=${this.instance}`,
    );

    if (!this.apiUrl || !this.apiKey || !this.instance) {
      this.logger.warn(
        '⚠️ Variáveis do WhatsApp incompletas. O envio não funcionará até configurar WHATSAPP_API_URL, WHATSAPP_API_KEY e WHATSAPP_INSTANCE.',
      );
    }
  }

  /**
   * Normaliza o número para o formato internacional brasileiro.
   * Ex: 48996126202 -> 5548996126202
   */
  private normalizePhoneNumber(phone: string): string {
    if (!phone) return '';

    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('55')) return cleaned;
    if (cleaned.length >= 10 && cleaned.length <= 11) return `55${cleaned}`;
    return cleaned; // já pode estar no formato internacional
  }

  /**
   * Envia mensagem de texto simples.
   */
  async sendMessage(to: string, message: string): Promise<boolean> {
    this.logger.log(`📤 Enviando mensagem para ${to}`);

    if (!to) {
      this.logger.warn('❌ Número de destino vazio.');
      return false;
    }

    if (!this.apiUrl || !this.apiKey || !this.instance) {
      this.logger.error('❌ Configuração do WhatsApp ausente.');
      return false;
    }

    const phone = this.normalizePhoneNumber(to);
    if (!phone || phone.length < 12) {
      this.logger.error(`❌ Número inválido após normalização: ${to} -> ${phone}`);
      return false;
    }

    const url = `${this.apiUrl}/message/sendText/${this.instance}`;
    const payload = { number: phone, text: message };

    this.logger.log(`📡 URL: ${url}`);
    this.logger.log(`📦 Payload: ${JSON.stringify(payload)}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      this.logger.log(
        `✅ Resposta Evolution API: status=${response.status} | body=${responseText}`,
      );

      if (!response.ok) {
        this.logger.error(
          `❌ Erro na Evolution API: status=${response.status} | body=${responseText}`,
        );
        return false;
      }

      this.logger.log(`✅ Mensagem enviada com sucesso para ${phone}`);
      return true;
    } catch (error: any) {
      this.logger.error(`❌ Exceção no envio: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Envia comprovante de venda no formato padrão.
   */
  async sendSaleReceipt(
    to: string,
    saleData: any,
    userData?: { nomeNegocio?: string; cnpj?: string },
  ): Promise<boolean> {
    const message = this.buildSaleMessage(saleData, userData);
    this.logger.log(`📝 Mensagem comprovante:\n${message}`);
    return this.sendMessage(to, message);
  }

  private buildSaleMessage(
    sale: any,
    userData?: { nomeNegocio?: string; cnpj?: string },
  ): string {
    const cliente = sale.clienteNome || 'Cliente não identificado';
    const produtos = sale.produto || 'Produto não informado';
    const valor = Number(sale.valorTotal).toFixed(2);
    const data = sale.dataVenda
      ? new Date(sale.dataVenda).toLocaleDateString('pt-BR')
      : new Date().toLocaleDateString('pt-BR');
    const canal = sale.canalVenda || 'Balcão';

    let empresaInfo = '';
    if (userData?.nomeNegocio) {
      empresaInfo += `🏢 Empresa: ${userData.nomeNegocio}\n`;
    }
    if (userData?.cnpj) {
      empresaInfo += `📋 CNPJ: ${userData.cnpj}\n`;
    }

    return [
      '🧾 *Comprovante de Venda* 🧾',
      '',
      `📅 Data: ${data}`,
      `👤 Cliente: ${cliente}`,
      `🛒 Produto(s): ${produtos}`,
      `💰 Valor: R$ ${valor}`,
      `📦 Canal: ${canal}`,
      empresaInfo,
      '🎉 *Parabéns pela sua compra!*',
    ]
      .filter(Boolean)
      .join('\n');
  }
}