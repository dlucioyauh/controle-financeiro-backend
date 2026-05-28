import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  nome!: string;

  @Column({ type: 'varchar', nullable: true })
  telefone!: string | null;

  @Column({ type: 'varchar', nullable: true })
  endereco!: string | null;

  @Column({ type: 'varchar', nullable: true })
  bairro!: string | null;

  @Column({ type: 'varchar', nullable: true })
  cidade!: string | null;

  @Column({ type: 'varchar', nullable: true })
  usuario!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}