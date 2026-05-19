import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ingrediente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @Column()
  unidade: string; // kg, litro, un, g, ml
}