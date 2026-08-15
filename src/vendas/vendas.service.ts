import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { VendaEntity } from './venda.entity';
import { UsersService } from '../users/users.service';
import { ClientesService } from '../clientes/clientes.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(VendaEntity)
    private vendaRepository: Repository<VendaEntity>,
    private usersService: UsersService,
    private clientesService: ClientesService,
    private configService: ConfigService,
    private whatsappService: WhatsAppService,
  ) {}

  async criar(data: Partial<VendaEntity>): Promise<VendaEntity> {
    console.log('🚀 MÉTODO CRIAR FOI CHAMADO');
    console.log('📝 Criando venda com dados:', data);

    if (data.valorTotal && data.quantidade) {
      data.precoUnitario = Number(data.valorTotal) / Number(data.quantidade);
    }

    const venda = this.vendaRepository.create(data);
    const saved = await this.vendaRepository.save(venda);
    console.log('✅ Venda salva, ID:', saved.id);

    // --- Envia comprovante via WhatsApp ---
    try {
      const user = await this.usersService.findOne(data.usuario || '');
      console.log('📱 TENTANDO ENVIAR WHATSAPP...');
      console.log('👤 Usuário:', user?.username, 'WhatsApp ativado?', user?.whatsappEnabled);

      if (user?.whatsappEnabled && user?.whatsappNumber) {
        let targetNumber: string | null = null;

        // 🔍 Prioridade 1: busca telefone do cliente
        if (data.clienteId) {
          console.log('🔍 Buscando cliente com ID:', data.clienteId);
          try {
            const cliente = await this.clientesService.buscarPorId(data.clienteId);
            console.log('📦 Cliente encontrado:', cliente);
            if (cliente?.telefone) {
              targetNumber = cliente.telefone;
              console.log('📱 Telefone do cliente encontrado:', targetNumber);
            } else {
              console.log('⚠️ Cliente não possui telefone cadastrado.');
            }
          } catch (err) {
            console.log('⚠️ Cliente não encontrado com o ID fornecido.');
          }
        }

        // 🔽 Fallback
        if (!targetNumber) {
          targetNumber = user.whatsappNumber;
          console.log('📱 Usando telefone do usuário (fallback):', targetNumber);
        }

        if (targetNumber) {
          console.log('📤 Enviando comprovante para:', targetNumber);
          const userData = {
            nomeNegocio: user?.nomeNegocio || undefined,
            cnpj: user?.cnpj || undefined,
          };
          const result = await this.whatsappService.sendSaleReceipt(targetNumber, saved, userData);
          console.log('📤 Resultado do envio:', result);
        } else {
          console.log('⚠️ Nenhum número de telefone disponível para envio.');
        }
      } else {
        console.log('⚠️ WhatsApp não ativado para este usuário ou número não configurado.');
      }
    } catch (error: any) {
      console.error('❌ Erro ao enviar comprovante WhatsApp:', error.message);
    }

    return saved;
  }

  // ... (os outros métodos permanecem iguais)
}