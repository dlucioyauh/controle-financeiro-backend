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

@Entity('despesas')
export class DespesaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  descricao!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor!: number;

  @Column({ type: 'varchar', nullable: true })
  categoria!: string | null;

  @Column({ type: 'varchar', default: 'YYYY-MM-DD' }) // Ajuste conforme seu padrão atual
  data!: string;

  @Column({ type: 'varchar', nullable: true })
  usuario!: string | null;

  @Column({ type: 'uuid' })
  userId!: string;

  // ✅ NOVO CAMPO: Para separar DRE Empresarial do Pessoal
  @Column({ type: 'varchar', enum: ['EMPRESA', 'PESSOAL'], default: 'EMPRESA' })
  ambito!: 'EMPRESA' | 'PESSOAL';

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}