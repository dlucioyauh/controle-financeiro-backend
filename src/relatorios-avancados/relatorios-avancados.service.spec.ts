import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RelatoriosAvancadosService } from './relatorios-avancados.service';
import { VendaEntity } from '../vendas/venda.entity';
import { DespesaEntity } from '../despesas/despesa.entity';
import { Customer } from '../clientes/customer.entity';

describe('RelatoriosAvancadosService', () => {
  let service: RelatoriosAvancadosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RelatoriosAvancadosService,
        { provide: getRepositoryToken(VendaEntity), useValue: { find: jest.fn() } },
        { provide: getRepositoryToken(DespesaEntity), useValue: { find: jest.fn() } },
        { provide: getRepositoryToken(Customer), useValue: {} },
      ],
    }).compile();
    service = module.get(RelatoriosAvancadosService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });
});