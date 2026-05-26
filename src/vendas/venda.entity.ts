import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('vendas')
export class VendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  produto!: string;

  @Column({ type: 'int' })
  quantidade!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  precoUnitario!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  valorTotal!: number;

  @Column({ type: 'varchar', default: 'Balcão' })
  canalVenda!: string;

  @Column({ type: 'timestamp' })
  dataVenda!: Date;

  @Column({ type: 'varchar', nullable: true })
  usuario!: string | null;

  @Column({ type: 'varchar', nullable: true })
  clienteId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  clienteNome!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}