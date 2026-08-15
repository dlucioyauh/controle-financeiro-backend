import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vendas')
export class VendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  dataVenda!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valorTotal!: number;

  @Column({ type: 'varchar' })
  produto!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1 })
  quantidade!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precoUnitario!: number | null; // ← NOVO

  @Column({ type: 'varchar', nullable: true })
  canalVenda!: string | null;

  @Column({ type: 'varchar', nullable: true })
  clienteNome!: string | null;

  @Column({ type: 'varchar', nullable: true })
  clienteTelefone!: string | null;

  @Column({ type: 'varchar', nullable: true })
  clienteId!: string | null;

  @Column({ type: 'varchar' })
  usuario!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}