import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Venda {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  criadoEm: Date;

  @Column({ type: 'date' })
  data: string;

  @Column({ nullable: true })
  nomeCliente: string;

  @Column({ nullable: true })
  enderecoCliente: string;

  @Column({ nullable: true })
  bairroCliente: string;

  @Column({ nullable: true })
  cidadeCliente: string;

  @Column({
    type: 'enum',
    enum: ['cliente_final', 'parceiro', 'ifood', 'outro'],
    default: 'cliente_final',
  })
  canal: string;

  @Column({ nullable: true })
  observacao: string; // ex: "Natal", "Dia das Mães", "Feriado"

  @Column({
    type: 'enum',
    enum: ['pendente', 'pago', 'cancelado'],
    default: 'pago',
  })
  status: string;

  @Column('jsonb')
  itens: {
    produtoId?: number;
    nomeProduto: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
  }[];

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ nullable: true })
  formaPagamento: string;
}