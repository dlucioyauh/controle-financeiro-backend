import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';

export type TipoRecorrencia = 'RECEITA' | 'DESPESA';
export type AmbitoRecorrencia = 'EMPRESA' | 'PESSOAL';
export type FrequenciaRecorrencia = 'DIARIA' | 'SEMANAL' | 'MENSAL' | 'ANUAL';

@Entity('recorrencias')
export class RecorrenciaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  descricao!: string;

  @Column({ type: 'varchar', enum: ['RECEITA', 'DESPESA'] })
  tipo!: TipoRecorrencia;

  @Column({ type: 'varchar', enum: ['EMPRESA', 'PESSOAL'], default: 'EMPRESA' })
  ambito!: AmbitoRecorrencia; // ✅ NOVO CAMPO

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor!: number;

  @Column({ type: 'varchar', enum: ['DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL'], default: 'MENSAL' })
  frequencia!: FrequenciaRecorrencia;

  @Column({ type: 'timestamp' })
  proximaExecucao!: Date;

  @Column({ type: 'boolean', default: true })
  ativa!: boolean;

  @Column({ type: 'varchar', nullable: true })
  categoria!: string | null;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column({ type: 'uuid' })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}