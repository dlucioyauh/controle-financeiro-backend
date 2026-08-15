import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private apiUrl: string;
  private apiKey: string;
  private instance: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get('WHATSAPP_API_URL') || '';
    this.apiKey = this.configService.get('WHATSAPP_API_KEY') || '';
    this.instance = this.configService.get('WHATSAPP_INSTANCE') || '';
  }

  private normalizePhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('55')) return cleaned;
    if (cleaned.length >= 10 && cleaned.length <= 11) return `55${cleaned}`;
    return phone;
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    if (!this.apiUrl || !this.apiKey || !this.instance) {
      this.logger.error('WhatsApp não configurado.');
      return false;
    }

    const phone = this.normalizePhoneNumber(to);
    if (!phone || phone.length < 12) {
      this.logger.error(`Número inválido: ${to}`);
      return false;
    }

    const url = `${this.apiUrl}/message/sendText/${this.instance}`;
    const payload = { number: phone, text: message };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Erro: ${response.status} - ${errorText}`);
        return false;
      }

      this.logger.log(`Mensagem enviada para ${phone}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Erro: ${error.message}`);
      return false;
    }
  }

  async sendSaleReceipt(to: string, saleData: any, userData?: { nomeNegocio?: string; cnpj?: string }): Promise<boolean> {
    const message = this.buildSaleMessage(saleData, userData);
    return this.sendMessage(to, message);
  }

  private buildSaleMessage(sale: any, userData?: { nomeNegocio?: string; cnpj?: string }): string {
    const cliente = sale.clienteNome || 'Cliente não identificado';
    const produtos = sale.produto || 'Produto não informado';
    const valor = Number(sale.valorTotal).toFixed(2);
    const data = new Date(sale.dataVenda).toLocaleDateString('pt-BR');
    const canal = sale.canalVenda || 'Balcão';

    let empresaInfo = '';
    if (userData?.nomeNegocio) {
      empresaInfo += `🏢 Empresa: ${userData.nomeNegocio}\n`;
    }
    if (userData?.cnpj) {
      empresaInfo += `📋 CNPJ: ${userData.cnpj}\n`;
    }

    return `
🧾 *Comprovante de Venda* 🧾

📅 Data: ${data}
👤 Cliente: ${cliente}
🛒 Produto(s): ${produtos}
💰 Valor: R$ ${valor}
📦 Canal: ${canal}
${empresaInfo}
🎉 *Parabéns pela sua compra!*
    `.trim();
  }
}