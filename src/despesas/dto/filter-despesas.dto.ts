import { IsOptional, IsBoolean, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterDespesasDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  pessoal?: boolean;

  @IsOptional()
  @IsIn(['despesa', 'receita'])
  tipo?: 'despesa' | 'receita';
}