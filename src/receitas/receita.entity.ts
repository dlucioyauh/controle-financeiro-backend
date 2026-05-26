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

  @Column({ type: 'varchar' })
  nome!: string;

  @Column({ type: 'varchar', nullable: true })
  descricao!: string | null;

  @Column({ type: 'int' })
  rendimento!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  maoDeObra!: number;

  @Column({ type: 'varchar', nullable: true })
  unidadeRendimento!: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 10 })
  custosFixosPorcentagem!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  custoIngredientes!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  precoVendaFinal!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  precoVendaParceiro!: number;

  @Column({ type: 'jsonb', nullable: true })
  ingredientes!: any;

  @Column({ type: 'varchar', nullable: true })
  usuario!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}