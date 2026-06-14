import { DespesasService } from './despesas.service';
import { DespesaEntity } from './despesa.entity';
import { Repository } from 'typeorm';

describe('DespesasService', () => {
  let service: DespesasService;
  let mockRepository: jest.Mocked<Repository<DespesaEntity>>;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
    } as any;
    service = new DespesasService(mockRepository);
  });

  describe('getTotais', () => {
    it('deve calcular totais para despesas da empresa (pessoal=false, tipo=despesa)', async () => {
      const mockDespesas = [
        { valor: 100, tipo: 'despesa', pessoal: false },
        { valor: 50, tipo: 'despesa', pessoal: false },
      ];
      mockRepository.find.mockResolvedValue(mockDespesas as any);

      const result = await service.getTotais('user123', false, 'despesa');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { usuario: 'user123', pessoal: false, tipo: 'despesa' }
      });
      expect(result).toEqual({ total: 150, quantidade: 2 });
    });

    it('deve calcular totais para despesas pessoais (pessoal=true, tipo=despesa)', async () => {
      const mockDespesas = [{ valor: 30, tipo: 'despesa', pessoal: true }];
      mockRepository.find.mockResolvedValue(mockDespesas as any);

      const result = await service.getTotais('user123', true, 'despesa');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { usuario: 'user123', pessoal: true, tipo: 'despesa' }
      });
      expect(result).toEqual({ total: 30, quantidade: 1 });
    });

    it('deve calcular totais para receitas pessoais (pessoal=true, tipo=receita)', async () => {
      const mockReceitas = [
        { valor: 200, tipo: 'receita', pessoal: true },
        { valor: 100, tipo: 'receita', pessoal: true },
      ];
      mockRepository.find.mockResolvedValue(mockReceitas as any);

      const result = await service.getTotais('user123', true, 'receita');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { usuario: 'user123', pessoal: true, tipo: 'receita' }
      });
      expect(result).toEqual({ total: 300, quantidade: 2 });
    });

    it('deve retornar total 0 e quantidade 0 quando não há registros', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getTotais('user123', false);

      expect(result).toEqual({ total: 0, quantidade: 0 });
    });
  });
});