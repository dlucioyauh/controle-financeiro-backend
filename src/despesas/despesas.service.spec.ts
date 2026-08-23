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
    } as unknown as jest.Mocked<Repository<DespesaEntity>>;
    
    service = new DespesasService(mockRepository as unknown as any);
  });

  describe('getTotais', () => {
    it('deve calcular totais para despesas da empresa (pessoal=false, tipo=despesa)', async () => {
      const mockDespesas = [
        { valor: 100, tipo: 'despesa', pessoal: false } as DespesaEntity,
        { valor: 50, tipo: 'despesa', pessoal: false } as DespesaEntity,
      ];
      mockRepository.find.mockResolvedValue(mockDespesas);

      const result = await service.getTotais('user123', false, 'despesa');

      // ✅ CORREÇÃO: userId em vez de usuario
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', pessoal: false, tipo: 'despesa' }
      });
      expect(result).toEqual({ total: 150, quantidade: 2 });
    });

    it('deve calcular totais para despesas pessoais (pessoal=true, tipo=despesa)', async () => {
      const mockDespesas = [{ valor: 30, tipo: 'despesa', pessoal: true } as DespesaEntity];
      mockRepository.find.mockResolvedValue(mockDespesas);

      const result = await service.getTotais('user123', true, 'despesa');

      // ✅ CORREÇÃO: userId em vez de usuario
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', pessoal: true, tipo: 'despesa' }
      });
      expect(result).toEqual({ total: 30, quantidade: 1 });
    });

    it('deve calcular totais para receitas pessoais (pessoal=true, tipo=receita)', async () => {
      const mockReceitas = [
        { valor: 200, tipo: 'receita', pessoal: true } as DespesaEntity,
        { valor: 100, tipo: 'receita', pessoal: true } as DespesaEntity,
      ];
      mockRepository.find.mockResolvedValue(mockReceitas);

      const result = await service.getTotais('user123', true, 'receita');

      // ✅ CORREÇÃO: userId em vez de usuario
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', pessoal: true, tipo: 'receita' }
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