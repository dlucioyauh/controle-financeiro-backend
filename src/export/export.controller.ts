import { Controller, Get, Query, Res, Req, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('export')
@UseGuards(AuthGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('vendas')
  async exportVendas(
    @Req() req: any,
    @Res() res: Response, // ✅ Parâmetro obrigatório movido para antes dos opcionais
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user?.userId || req.user?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    try {
      const buffer = await this.exportService.exportVendasExcel(userId, startDate, endDate);
      const filename = `relatorio_vendas_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Erro ao gerar relatório' });
    }
  }
}