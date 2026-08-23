import { Controller, Get, Query, UseGuards, Req, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
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

    // ✅ CORREÇÃO: Sanitizar strings vazias para undefined para evitar falhas no validador e no Date
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
      // ✅ CORREÇÃO: Passar userId em vez de username
      return await this.service.getResumoGeral(user.userId, filtros);
    } catch (error) {
      const err = error as Error;
      throw new InternalServerErrorException(`Erro ao processar relatório: ${err.message}`);
    }
  }
}