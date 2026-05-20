import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('vendas')
export class VendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  produto: string; // Ex: "Ovo de Páscoa Trufado", "Brownie Tradicional", "Brigadeiro"

  @Column('int')
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valorTotal: number;

  @Column({ default: 'Balcão' })
  canalVenda: string; // Balcão, iFood, Encomenda, WhatsApp, Café

  @Column({ default: 'Regular' })
  contextoData: string; // Regular, Páscoa, Natal, Dia das Mães, Feriado

  @CreateDateColumn()
  dataVenda: Date;
}