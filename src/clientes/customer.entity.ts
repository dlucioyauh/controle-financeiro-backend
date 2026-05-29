import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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
  estado!: string | null;          // novo

  @Column({ type: 'varchar', nullable: true })
  cep!: string | null;             // novo

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude!: number | null;        // novo

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude!: number | null;       // novo

  @Column({ type: 'varchar', nullable: true })
  usuario!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
