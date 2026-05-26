import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('ingredientes')
export class IngredienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  nome!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  precoCompra!: number | null;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  quantidadeCompra!: number | null;

  @Column({ type: 'varchar', nullable: true })
  unidadeMedida!: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  preco!: number | null;

  @Column({ type: 'varchar', nullable: true })
  unidade!: string | null;

  @Column({ type: 'varchar', nullable: true })
  usuario!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}