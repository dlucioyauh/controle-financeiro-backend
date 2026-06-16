import { IsOptional, IsString, IsDateString, IsIn, IsUUID } from 'class-validator';

export class RelatorioFiltrosDto {
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @IsOptional()
  @IsString()
  clienteId?: string;

  @IsOptional()
  @IsString()
  produto?: string;

  @IsOptional()
  @IsIn(['venda', 'despesa', 'ambos'])
  tipo?: 'venda' | 'despesa' | 'ambos';
}