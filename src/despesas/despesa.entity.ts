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
  data!: string; // formato 'YYYY-MM-DD'

  @Column({ type: 'varchar', length: 50, nullable: true })
  categoria!: string | null;

  @Column({ type: 'varchar', nullable: true })
  usuario!: string | null;   // ← NOVA COLUNA

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}