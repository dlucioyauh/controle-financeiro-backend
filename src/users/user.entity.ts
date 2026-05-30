import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, type: 'varchar' })
  username!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  nome!: string | null;

  @Column({ type: 'varchar', nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', nullable: true })
  nomeNegocio!: string | null;

  @Column({ type: 'varchar', nullable: true })
  telefone!: string | null;

  @Column({ type: 'varchar', nullable: true })
  enderecoOrigem!: string | null;

  @Column({ type: 'varchar', nullable: true })
  bairroOrigem!: string | null;

  @Column({ type: 'varchar', nullable: true })
  cidadeOrigem!: string | null;

  @Column({ type: 'varchar', nullable: true })
  estadoOrigem!: string | null;

  @Column({ type: 'varchar', nullable: true })
  cepOrigem!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitudeOrigem!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitudeOrigem!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.80 })
  taxaFreteKm!: number;

  @Column({ type: 'varchar', length: 18, nullable: true })
  cnpj!: string | null;

  @Column({ type: 'varchar', nullable: true })
  logo!: string | null;

  @Column({ type: 'varchar', default: 'free' })
  plano!: string;

  @Column({ type: 'varchar', default: 'dark' })
  tema!: string;

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt!: Date | null;   // ← NOVO CAMPO

  @CreateDateColumn()
  createdAt!: Date;
}