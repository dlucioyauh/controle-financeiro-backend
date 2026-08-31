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
    it('deve calcular totais para despesas da empresa (ambito=EMPRESA)', async () => {
      const mockDespesas = [{ valor: 100 }, { valor: 200 }];
      mockRepository.find.mockResolvedValue(mockDespesas);

      const result = await service.getTotais('user123', false, 'despesa');

      // ✅ CORREÇÃO: Removido 'tipo' da asserção, pois a coluna não existe na entidade
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', ambito: 'EMPRESA' },
      });
      expect(result).toEqual({ total: 300, quantidade: 2 });
    });

    it('deve calcular totais para despesas pessoais (ambito=PESSOAL)', async () => {
      const mockDespesas = [{ valor: 50 }];
      mockRepository.find.mockResolvedValue(mockDespesas);

      const result = await service.getTotais('user123', true, 'despesa');

      // ✅ CORREÇÃO: Removido 'tipo' da asserção
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', ambito: 'PESSOAL' },
      });
      expect(result).toEqual({ total: 50, quantidade: 1 });
    });

    it('deve calcular totais para receitas pessoais (ambito=PESSOAL)', async () => {
      const mockReceitas = [{ valor: 1000 }];
      mockRepository.find.mockResolvedValue(mockReceitas);

      const result = await service.getTotais('user123', true, 'receita');

      // ✅ CORREÇÃO: Removido 'tipo' da asserção
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', ambito: 'PESSOAL' },
      });
      expect(result).toEqual({ total: 1000, quantidade: 1 });
    });

    it('deve retornar total 0 e quantidade 0 quando não há registros', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getTotais('user123', false);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', ambito: 'EMPRESA' },
      });
      expect(result).toEqual({ total: 0, quantidade: 0 });
    });
  });
});