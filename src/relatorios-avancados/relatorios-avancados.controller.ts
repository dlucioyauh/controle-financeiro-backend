import { Controller, Get, Query, UseGuards, Req, ForbiddenException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { PlanoGuard } from '../auth/plano.guard';
import { RelatoriosAvancadosService } from './relatorios-avancados.service';
import type { Request } from 'express';

@Controller('relatorios-avancados')
@UseGuards(AuthGuard, PlanoGuard)
export class RelatoriosAvancadosController {
  constructor(
    private service: RelatoriosAvancadosService,
    private featureFlags: FeatureFlagsService,
  ) {}

  @Get('resumo')
  async getResumo(@Req() req: Request, @Query() query: any) {
    const user = (req as any).user;

    const filtros = {
      dataInicio: query.dataInicio || undefined,
      dataFim: query.dataFim || undefined,
      tipo: query.tipo || 'ambos',
      produto: query.produto || undefined,
      clienteId: query.clienteId || undefined,
    };

    const enabled = await this.featureFlags.findByName('novo_relatorio');
    if (!enabled) {
      throw new ForbiddenException('Relatórios avançados não disponíveis. Contate o administrador.');
    }

    try {
      return await this.service.getResumoGeral(user.userId, filtros);
    } catch (error) {
      const err = error as Error;
      throw new InternalServerErrorException(`Erro ao processar relatório: ${err.message}`);
    }
  }

  // ✅ NOVO ENDPOINT: DRE Automático
  @Get('dre')
  async getDre(
    @Req() req: Request,
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Query('ambito') ambito?: string,
  ) {
    const user = (req as any).user;

    // Validação de Feature Flag (mesma do /resumo)
    const enabled = await this.featureFlags.findByName('novo_relatorio');
    if (!enabled) {
      throw new ForbiddenException('DRE não disponível. Contate o administrador.');
    }

    // Validação de parâmetros obrigatórios
    if (!dataInicio || !dataFim) {
      throw new BadRequestException('dataInicio e dataFim são obrigatórios');
    }

    // Validação do âmbito
    const ambitoValido = ['EMPRESA', 'PESSOAL', 'TODOS'].includes(ambito || 'TODOS')
      ? (ambito as 'EMPRESA' | 'PESSOAL' | 'TODOS')
      : 'TODOS';

    try {
      return await this.service.gerarDre(user.userId, dataInicio, dataFim, ambitoValido);
    } catch (error) {
      const err = error as Error;
      throw new InternalServerErrorException(`Erro ao gerar DRE: ${err.message}`);
    }
  }
}