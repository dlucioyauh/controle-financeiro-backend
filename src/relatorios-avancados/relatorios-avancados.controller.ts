import { 
  Controller, Get, Query, UseGuards, Req, 
  ForbiddenException, InternalServerErrorException, BadRequestException 
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { PlanoGuard } from '../auth/plano.guard';
import { RelatoriosAvancadosService } from './relatorios-avancados.service';
import type { Request } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

@Controller('relatorios-avancados')
@UseGuards(AuthGuard, PlanoGuard)
export class RelatoriosAvancadosController {
  constructor(
    private service: RelatoriosAvancadosService,
    private featureFlags: FeatureFlagsService,
  ) {}

  @Get('resumo')
  async getResumo(@Req() req: CustomRequest, @Query() query: any) {
    const userId = req.user!.userId;
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
      return await this.service.getResumoGeral(userId, filtros);
    } catch (error) {
      const err = error as Error;
      throw new InternalServerErrorException(`Erro ao processar relatório: ${err.message}`);
    }
  }

  @Get('dre')
  async getDre(
    @Req() req: CustomRequest,
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Query('ambito') ambito?: 'EMPRESA' | 'PESSOAL' | 'TODOS',
  ) {
    const userId = req.user!.userId;

    const enabled = await this.featureFlags.findByName('novo_relatorio');
    if (!enabled) {
      throw new ForbiddenException('Relatórios avançados não disponíveis. Contate o administrador.');
    }

    if (!dataInicio || !dataFim) {
      throw new BadRequestException('dataInicio e dataFim são obrigatórios');
    }

    return this.service.gerarDre(userId, dataInicio, dataFim, ambito);
  }
}