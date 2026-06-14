import { SentryFilter } from './sentry.filter';

describe('SentryFilter', () => {
  let filter: SentryFilter;

  beforeEach(() => {
    filter = new SentryFilter();
  });

  describe('redactSensitiveData', () => {
    it('deve redactar campo password', () => {
      const body = { username: 'joao', password: '123456' };
      const result = (filter as any).redactSensitiveData(body);
      expect(result).toEqual({ username: 'joao', password: '[REDACTED]' });
    });

    it('deve redactar campos em diferentes cases', () => {
      const body = { Password: 'secret', CurrentPassword: 'old' };
      const result = (filter as any).redactSensitiveData(body);
      expect(result).toEqual({ Password: '[REDACTED]', CurrentPassword: '[REDACTED]' });
    });

    it('deve redactar recursivamente', () => {
      const body = { user: { name: 'Maria', password: 'abc' }, token: 'xyz' };
      const result = (filter as any).redactSensitiveData(body);
      expect(result).toEqual({
        user: { name: 'Maria', password: '[REDACTED]' },
        token: '[REDACTED]',
      });
    });

    it('deve manter campos não sensíveis', () => {
      const body = { email: 'teste@email.com', age: 30 };
      const result = (filter as any).redactSensitiveData(body);
      expect(result).toEqual(body);
    });

    it('deve tratar arrays', () => {
      const body = { items: [{ password: '123' }, { name: 'item2' }] };
      const result = (filter as any).redactSensitiveData(body);
      expect(result).toEqual({
        items: [{ password: '[REDACTED]' }, { name: 'item2' }],
      });
    });

    it('deve retornar o mesmo valor se não for objeto', () => {
      expect((filter as any).redactSensitiveData(null)).toBe(null);
      expect((filter as any).redactSensitiveData('texto')).toBe('texto');
      expect((filter as any).redactSensitiveData(123)).toBe(123);
    });
  });
});