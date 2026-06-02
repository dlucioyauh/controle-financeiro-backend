import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('despesa')
export class DespesaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  descricao!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor!: number;

  @Column({ type: 'date' })
  data!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  categoria!: string | null;

  @Column({ type: 'varchar', nullable: true })
  usuario!: string | null;

  @Column({ type: 'boolean', default: false })
  pessoal!: boolean;

  @Column({ type: 'varchar', default: 'despesa' })
  tipo!: string;   // 'despesa' ou 'receita'

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}