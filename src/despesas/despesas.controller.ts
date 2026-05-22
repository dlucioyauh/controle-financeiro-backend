import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { DespesasService } from './despesas.service';

@UseGuards(AuthGuard)
@Controller('despesas')
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.despesasService.create(body, req.user.username);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.despesasService.findAll(req.user.username);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.despesasService.remove(Number(id), req.user.username);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dados: any, @Req() req: any) {
    return this.despesasService.update(Number(id), dados, req.user.username);
  }
}