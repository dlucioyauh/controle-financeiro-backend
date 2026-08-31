import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DespesasService } from './despesas.service';
import { DespesaEntity } from './despesa.entity';

describe('DespesasService', () => {
  let service: DespesasService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((dto) => dto),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DespesasService,
        {
          provide: getRepositoryToken(DespesaEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DespesasService>(DespesasService);
  });

  describe('getTotais', () => {
    it('deve calcular totais para despesas da empresa (ambito=EMPRESA, tipo=DESPESA)', async () => {
      const mockDespesas = [{ valor: 100 }, { valor: 200 }];
      mockRepository.find.mockResolvedValue(mockDespesas);

      const result = await service.getTotais('user123', false, 'despesa');

      // ✅ CORREÇÃO: Agora esperamos o filtro 'tipo' pois a coluna foi adicionada à entidade
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', ambito: 'EMPRESA', tipo: 'DESPESA' },
      });
      expect(result).toEqual({ total: 300, quantidade: 2 });
    });

    it('deve calcular totais para despesas pessoais (ambito=PESSOAL, tipo=DESPESA)', async () => {
      const mockDespesas = [{ valor: 50 }];
      mockRepository.find.mockResolvedValue(mockDespesas);

      const result = await service.getTotais('user123', true, 'despesa');

      // ✅ CORREÇÃO: Espera filtro com tipo 'DESPESA'
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', ambito: 'PESSOAL', tipo: 'DESPESA' },
      });
      expect(result).toEqual({ total: 50, quantidade: 1 });
    });

    it('deve calcular totais para receitas pessoais (ambito=PESSOAL, tipo=RECEITA)', async () => {
      const mockReceitas = [{ valor: 1000 }];
      mockRepository.find.mockResolvedValue(mockReceitas);

      const result = await service.getTotais('user123', true, 'receita');

      // ✅ CORREÇÃO: Espera filtro com tipo 'RECEITA'
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', ambito: 'PESSOAL', tipo: 'RECEITA' },
      });
      expect(result).toEqual({ total: 1000, quantidade: 1 });
    });

    it('deve calcular totais sem filtro de tipo específico', async () => {
      const mockRegistros = [{ valor: 100 }, { valor: 50 }];
      mockRepository.find.mockResolvedValue(mockRegistros);

      const result = await service.getTotais('user123', false);

      // ✅ CORREÇÃO: Quando 'tipo' não é passado, ele não deve estar no where
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', ambito: 'EMPRESA' },
      });
      expect(result).toEqual({ total: 150, quantidade: 2 });
    });
  });
});