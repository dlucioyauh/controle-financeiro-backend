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

  // ✅ CORREÇÃO DE SEGURANÇA: Adicionado `default: 0` para garantir que o TypeORM 
  // nunca mais tente criar esta coluna como NOT NULL sem valor padrão, 
  // evitando completamente o crash de sincronização (QueryFailedError).
  @Column({ type: 'int', default: 0 })
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

  @Column({ type: 'uuid', nullable: true })
  userId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}