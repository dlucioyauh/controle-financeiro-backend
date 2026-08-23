import { SentryFilter } from './sentry.filter';

describe('SentryFilter', () => {
  let filter: SentryFilter;

  beforeEach(() => {
    filter = new SentryFilter();
  });

  describe('sanitizeObject', () => {
    it('deve redigir chaves sensíveis no nível raiz', () => {
      const body = { password: '123', username: 'admin', token: 'abc' };
      // Acessando método privado via type assertion para teste
      const result = (filter as any).sanitizeObject(body);
      
      expect(result).toEqual({
        password: '[REDACTED]',
        username: 'admin',
        token: '[REDACTED]',
      });
    });

    it('deve redigir chaves sensíveis em objetos aninhados', () => {
      const body = { 
        user: { 
          nome: 'João', 
          senha: 'segredo123',
          dados: { apiKey: 'key-123' }
        } 
      };
      const result = (filter as any).sanitizeObject(body);
      
      expect(result).toEqual({
        user: {
          nome: 'João',
          senha: '[REDACTED]',
          dados: {
            apiKey: '[REDACTED]'
          }
        }
      });
    });

    it('deve tratar arrays corretamente', () => {
      const body = { items: [{ password: '123' }, { name: 'item2' }] };
      const result = (filter as any).sanitizeObject(body);
      
      expect(result).toEqual({
        items: [{ password: '[REDACTED]' }, { name: 'item2' }],
      });
    });

    it('deve retornar o mesmo valor se não for objeto', () => {
      expect((filter as any).sanitizeObject(null)).toBe(null);
      expect((filter as any).sanitizeObject('texto')).toBe('texto');
      expect((filter as any).sanitizeObject(123)).toBe(123);
    });

    it('deve ser case-insensitive para chaves sensíveis', () => {
      const body = { PASSWORD: '123', Token: 'abc', normal: 'ok' };
      const result = (filter as any).sanitizeObject(body);
      
      expect(result).toEqual({
        PASSWORD: '[REDACTED]',
        Token: '[REDACTED]',
        normal: 'ok',
      });
    });
  });
});