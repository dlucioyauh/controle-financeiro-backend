import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual } from 'typeorm';
import { RecorrenciaEntity } from './recorrencia.entity';
import { DespesaEntity } from '../despesas/despesa.entity';
import { VendaEntity } from '../vendas/venda.entity';

@Injectable()
export class RecorrenciasService {
  private readonly logger = new Logger(RecorrenciasService.name);

  constructor(
    @InjectRepository(RecorrenciaEntity)
    private recorrenciaRepository: Repository<RecorrenciaEntity>,
    private dataSource: DataSource,
  ) {}

  async criar(userId: string, data: Partial<RecorrenciaEntity>) {
    return this.recorrenciaRepository.save({ ...data, userId });
  }

  async listarPorUsuario(userId: string) {
    return this.recorrenciaRepository.find({
      where: { 
        userId, 
        ativa: true // ✅ Garante que só retorna regras ativas
      },
      order: { proximaExecucao: 'ASC' },
    });
  }

  async cancelar(id: string, userId: string) {
    return this.recorrenciaRepository.update({ id, userId }, { ativa: false });
  }

  async processarRecorrenciasPendentes() {
    const agora = new Date();
    this.logger.log(`Iniciando processamento de recorrências pendentes até ${agora.toISOString()}`);

    const pendentes = await this.recorrenciaRepository.find({
      where: {
        ativa: true,
        proximaExecucao: LessThanOrEqual(agora),
      },
    });

    if (pendentes.length === 0) {
      this.logger.log('Nenhuma recorrência pendente encontrada.');
      return;
    }

    this.logger.log(`${pendentes.length} recorrência(s) pendente(s) encontrada(s). Processando...`);

    for (const recorrencia of pendentes) {
      await this.dataSource.transaction(async (manager) => {
        try {
          if (recorrencia.tipo === 'DESPESA') {
            await manager.save(DespesaEntity, {
              descricao: `[AUTO] ${recorrencia.descricao}`,
              valor: recorrencia.valor,
              categoria: recorrencia.categoria || 'Recorrente',
              data: new Date().toISOString().split('T')[0], // ✅ CORREÇÃO: Converte Date para string 'YYYY-MM-DD'
              usuario: recorrencia.userId,
              userId: recorrencia.userId,
              ambito: recorrencia.ambito,
            });
          } else if (recorrencia.tipo === 'RECEITA') {
            await manager.save(VendaEntity, {
              produto: `[AUTO] ${recorrencia.descricao}`,
              valorTotal: recorrencia.valor,
              quantidade: 1,
              precoUnitario: recorrencia.valor,
              canalVenda: 'Recorrente',
              dataVenda: new Date(), // VendaEntity aceita Date aqui, então está ok
              usuario: recorrencia.userId,
              userId: recorrencia.userId,
            });
          }

          const proxima = new Date(recorrencia.proximaExecucao);
          switch (recorrencia.frequencia) {
            case 'DIARIA': proxima.setDate(proxima.getDate() + 1); break;
            case 'SEMANAL': proxima.setDate(proxima.getDate() + 7); break;
            case 'MENSAL': proxima.setMonth(proxima.getMonth() + 1); break;
            case 'ANUAL': proxima.setFullYear(proxima.getFullYear() + 1); break;
          }

          await manager.update(RecorrenciaEntity, recorrencia.id, {
            proximaExecucao: proxima,
          });

          this.logger.log(`✅ Processada com sucesso: ${recorrencia.descricao} (ID: ${recorrencia.id})`);
        } catch (error) {
          this.logger.error(`❌ Falha ao processar recorrência ${recorrencia.id}:`, error);
          throw error; // Faz o rollback da transação em caso de erro
        }
      });
    }
    
    this.logger.log('Processamento de recorrências concluído.');
  }
}