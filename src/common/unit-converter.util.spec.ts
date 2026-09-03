import { parseUnitInput, formatUnit, isValidUnit } from './unit-converter.util';

describe('Unit Converter', () => {
  describe('parseUnitInput', () => {
    it('deve converter gramas para kg', () => {
      expect(parseUnitInput('380g')).toBe(0.38);
      expect(parseUnitInput('500g')).toBe(0.5);
      expect(parseUnitInput('1000g')).toBe(1);
    });

    it('deve converter kg para kg (manter)', () => {
      expect(parseUnitInput('1kg')).toBe(1);
      expect(parseUnitInput('2,5kg')).toBe(2.5);
    });

    it('deve converter ml para L', () => {
      expect(parseUnitInput('500ml')).toBe(0.5);
      expect(parseUnitInput('1000ml')).toBe(1);
    });

    it('deve converter L para L (manter)', () => {
      expect(parseUnitInput('1L')).toBe(1);
      expect(parseUnitInput('1,5L')).toBe(1.5);
    });

    it('deve aceitar números puros sem unidade', () => {
      expect(parseUnitInput('10')).toBe(10);
      expect(parseUnitInput('0,5')).toBe(0.5);
    });

    it('deve retornar 0 para entradas inválidas', () => {
      expect(parseUnitInput('')).toBe(0);
      expect(parseUnitInput('abc')).toBe(0);
    });

    it('deve aceitar variações de unidades', () => {
      expect(parseUnitInput('380gramas')).toBe(0.38);
      expect(parseUnitInput('500mililitros')).toBe(0.5);
      expect(parseUnitInput('2unidades')).toBe(2);
    });
  });

  describe('formatUnit', () => {
    it('deve formatar peso em gramas se < 1kg', () => {
      expect(formatUnit(0.38, 'weight')).toBe('380g');
      expect(formatUnit(0.5, 'weight')).toBe('500g');
    });

    it('deve formatar peso em kg se >= 1kg', () => {
      expect(formatUnit(1, 'weight')).toBe('1,00kg');
      expect(formatUnit(2.5, 'weight')).toBe('2,50kg');
    });

    it('deve formatar volume em ml se < 1L', () => {
      expect(formatUnit(0.5, 'volume')).toBe('500ml');
    });

    it('deve formatar volume em L se >= 1L', () => {
      expect(formatUnit(1.5, 'volume')).toBe('1,50L');
    });
  });

  describe('isValidUnit', () => {
    it('deve retornar true para entradas válidas', () => {
      expect(isValidUnit('380g')).toBe(true);
      expect(isValidUnit('1kg')).toBe(true);
      expect(isValidUnit('500ml')).toBe(true);
    });

    it('deve retornar false para entradas inválidas', () => {
      expect(isValidUnit('')).toBe(false);
      expect(isValidUnit('abc')).toBe(false);
    });
  });
});