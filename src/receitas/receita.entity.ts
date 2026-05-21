import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('receitas')
export class ReceitaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao: string;

  @Column('int')
  rendimento: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  maoDeObra: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  lucroDesejado: number;

  @CreateDateColumn()
  createdAt: Date;

  // 🔒 IDENTIFICADOR MULTIUSUÁRIO:
  // Salva qual username é o dono desta receita
  @Column({ nullable: true })
  usuario: string;
}