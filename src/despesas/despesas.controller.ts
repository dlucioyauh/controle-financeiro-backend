import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { DespesaEntity } from './despesa.entity';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('despesas')
@UseGuards(AuthGuard)
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post()
  criar(
    @Body()
    data: {
      descricao: string;
      valor: number;
      data: string;
      categoria?: string;
      pessoal?: boolean;
    },
    @Req() req: Request,
  ): Promise<DespesaEntity> {
    const usuario = (req as any).user?.username;
    return this.despesasService.criar({ ...data, usuario });
  }

  // Despesas empresariais (padrão)
  @Get()
  listar(@Req() req: Request): Promise<DespesaEntity[]> {
    const usuario = (req as any).user?.username;
    return this.despesasService.listarPorUsuario(usuario);
  }

  // NOVA ROTA: Despesas pessoais
  @Get('pessoais')
  listarPessoais(@Req() req: Request): Promise<DespesaEntity[]> {
    const usuario = (req as any).user?.username;
    return this.despesasService.listarPessoais(usuario);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<DespesaEntity> {
    return this.despesasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    data: Partial<{
      descricao: string;
      valor: number;
      data: string;
      categoria: string;
      pessoal: boolean;
    }>,
  ): Promise<DespesaEntity> {
    return this.despesasService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.despesasService.remover(id);
  }
}