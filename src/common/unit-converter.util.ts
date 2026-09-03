/**
 * Utilitário para conversão automática de unidades de medida
 * Permite que usuários digitem valores como "380g", "1.5kg", "500ml"
 * e o sistema converte automaticamente para o padrão interno (kg ou L)
 */

export type UnitType = 'weight' | 'volume' | 'unit';

export interface ParsedUnit {
  value: number;
  unit: string;
  normalized: number; // Valor normalizado em kg ou L
  type: UnitType;
}

/**
 * Converte string de entrada (ex: "380g", "1.5kg") para número normalizado
 * @param input - String com valor e unidade (ex: "380g", "1,5kg", "500ml")
 * @returns Número normalizado em kg (peso) ou L (volume), ou 0 se inválido
 */
export function parseUnitInput(input: string): number {
  if (!input || typeof input !== 'string') return 0;

  const str = input.toLowerCase().trim();
  
  // Regex para capturar número e unidade
  const match = str.match(/^([\d.,]+)\s*(kg|g|gramas|grama|l|litro|litros|ml|mililitro|mililitros|un|und|unidade|unidades|pacote|pacotes|caixa|caixas)?$/);
  
  if (!match) {
    // Tenta converter diretamente para número
    const num = parseFloat(str.replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }
  
  const [, numStr, unit] = match;
  const num = parseFloat(numStr.replace(',', '.'));
  
  if (isNaN(num)) return 0;
  
  // Normaliza para kg (peso) ou L (volume)
  switch (unit) {
    // Peso: converte para kg
    case 'g':
    case 'gramas':
    case 'grama':
      return num / 1000; // 380g = 0,380kg
    
    case 'kg':
      return num; // Já está em kg
    
    // Volume: converte para L
    case 'ml':
    case 'mililitro':
    case 'mililitros':
      return num / 1000; // 500ml = 0,5L
    
    case 'l':
    case 'litro':
    case 'litros':
      return num; // Já está em L
    
    // Unidades: retorna o número puro
    case 'un':
    case 'und':
    case 'unidade':
    case 'unidades':
    case 'pacote':
    case 'pacotes':
    case 'caixa':
    case 'caixas':
      return num;
    
    default:
      return num; // Se não tem unidade, assume que já está normalizado
  }
}

/**
 * Formata número para exibição com unidade apropriada
 * @param value - Valor em kg ou L
 * @param type - Tipo de unidade ('weight' ou 'volume')
 * @returns String formatada (ex: "380g", "1,5kg", "500ml")
 */
export function formatUnit(value: number, type: UnitType = 'weight'): string {
  if (value === 0) return '0';
  
  if (type === 'weight') {
    // Se for menor que 1kg, exibe em gramas
    if (value < 1) {
      return `${(value * 1000).toFixed(0)}g`;
    }
    return `${value.toFixed(2).replace('.', ',')}kg`;
  }
  
  if (type === 'volume') {
    // Se for menor que 1L, exibe em ml
    if (value < 1) {
      return `${(value * 1000).toFixed(0)}ml`;
    }
    return `${value.toFixed(2).replace('.', ',')}L`;
  }
  
  return value.toString();
}

/**
 * Valida se a entrada é uma unidade válida
 * @param input - String a ser validada
 * @returns true se válido, false se inválido
 */
export function isValidUnit(input: string): boolean {
  if (!input) return false;
  const result = parseUnitInput(input);
  return result > 0;
}