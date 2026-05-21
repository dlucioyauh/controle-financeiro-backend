import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ingredientes')
export class IngredienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precoCompra: number;

  @Column('decimal', { precision: 10, scale: 2 })
  quantidadeCompra: number;

  @Column()
  unidadeMedida: string; // ex: g, kg, ml, un

  @CreateDateColumn()
  createdAt: Date;

  // 🔒 IDENTIFICADOR MULTIUSUÁRIO:
  // Vincula o ingrediente ao usuário que o cadastrou
  @Column({ nullable: true })
  usuario: string;
}