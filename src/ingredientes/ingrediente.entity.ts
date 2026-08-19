import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ingredientes')
export class IngredienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  nome!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  custo!: number | null;

  @Column({ type: 'varchar', nullable: true })
  unidade!: string | null;

  @Column({ type: 'varchar', nullable: true })
  usuario!: string | null;

  // ✅ NOVO CAMPO
  @Column({ type: 'uuid', nullable: true })
  userId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}