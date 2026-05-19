import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Receita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao: string;

  @Column('int')
  rendimento: number; // quantidade de unidades que a receita rende

  @Column({ nullable: true })
  unidadeRendimento: string; // unidades, fatias, porções

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  custoIngredientes: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  custosFixosPorcentagem: number; // % de custos fixos (agua, luz, gas)

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  maoDeObra: number; // valor em R$ da mão de obra por receita

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precoVendaFinal: number; // preço para cliente final

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precoVendaParceiro: number; // preço para parceiro/café

  // Ingredientes da receita armazenados como JSON
  @Column('jsonb', { nullable: true })
  ingredientes: {
    ingredienteId: number;
    nome: string;
    quantidade: number;
    unidade: string;
    custoUnitario: number;
    custoTotal: number;
  }[];
}