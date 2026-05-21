import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('receitas')
export class ReceitaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column({ nullable: true })
  descricao!: string;

  @Column('int')
  rendimento!: number;

  @Column({ nullable: true })
  unidadeRendimento!: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  maoDeObra!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 10 })
  custosFixosPorcentagem!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  custoIngredientes!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precoVendaFinal!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precoVendaParceiro!: number;

  @Column('jsonb', { nullable: true })
  ingredientes!: {
    ingredienteId: string;
    nome: string;
    quantidade: number;
    unidade: string;
    custoUnitario: number;
    custoTotal: number;
  }[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  usuario!: string;
}