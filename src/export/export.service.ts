import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { VendaEntity } from '../vendas/venda.entity'; // ✅ Nome correto da entidade

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(VendaEntity)
    private vendasRepository: Repository<VendaEntity>,
  ) {}

  async exportVendasExcel(userId: string, startDate?: string, endDate?: string) {
    const where: any = { userId };
    
    // Aplica filtro de data se fornecido
    if (startDate && endDate) {
      where.dataVenda = Between(new Date(startDate), new Date(endDate));
    }

    const vendas = await this.vendasRepository.find({
      where,
      order: { dataVenda: 'DESC' },
    });

    if (vendas.length === 0) {
      throw new BadRequestException('Nenhuma venda encontrada para os filtros selecionados.');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vendas');

    worksheet.columns = [
      { header: 'Data', key: 'data', width: 15 },
      { header: 'Produto', key: 'produto', width: 30 },
      { header: 'Cliente', key: 'cliente', width: 25 },
      { header: 'Qtd', key: 'qtd', width: 10 },
      { header: 'Valor Total (R$)', key: 'valor', width: 20 },
      { header: 'Canal', key: 'canal', width: 15 },
    ];

    // Estilo do cabeçalho (Cyan do IonFinance)
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0891B2' },
    };

    vendas.forEach((venda) => {
      worksheet.addRow({
        data: new Date(venda.dataVenda).toLocaleDateString('pt-BR'),
        produto: venda.produto,
        cliente: venda.clienteNome || 'Consumidor Final',
        qtd: venda.quantidade,
        valor: Number(venda.valorTotal).toFixed(2),
        canal: venda.canalVenda || 'Não informado',
      });
    });

    return await workbook.xlsx.writeBuffer();
  }
}