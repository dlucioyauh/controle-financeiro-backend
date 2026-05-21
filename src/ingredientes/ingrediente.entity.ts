import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ingredientes')
export class IngredienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precoCompra: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  quantidadeCompra: number;

  @Column({ nullable: true })
  unidadeMedida: string;

  // Campos compatíveis com o frontend
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  preco: number;

  @Column({ nullable: true })
  unidade: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  usuario: string;
}