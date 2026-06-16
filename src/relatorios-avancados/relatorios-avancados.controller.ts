import { Controller, Get, Query, UseGuards, Req, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { PlanoGuard } from '../auth/plano.guard';
import { RelatoriosAvancadosService } from './relatorios-avancados.service';
import { RelatorioFiltrosDto } from './dto/relatorio-filtros.dto';
import type { Request } from 'express';

@Controller('relatorios-avancados')
@UseGuards(AuthGuard, PlanoGuard)
export class RelatoriosAvancadosController {
  constructor(
    private service: RelatoriosAvancadosService,
    private featureFlags: FeatureFlagsService,
  ) {}

  @Get('resumo')
  async getResumo(@Req() req: Request, @Query() filtros: RelatorioFiltrosDto) {
    const user = (req as any).user;
    const usuario = user.username;

    const enabled = await this.featureFlags.findByName('novo_relatorio');
    if (!enabled) {
      throw new ForbiddenException('Relatórios avançados não disponíveis. Contate o administrador.');
    }

    try {
      return await this.service.getResumoGeral(usuario, filtros);
    } catch (error) {
      const err = error as Error;
      throw new InternalServerErrorException(`Erro ao processar relatório: ${err.message}`);
    }
  }
}