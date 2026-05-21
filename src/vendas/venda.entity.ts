import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('vendas')
export class VendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  produto: string;

  @Column('int')
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valorTotal: number;

  @Column({ default: 'Balcão' })
  canalVenda: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataVenda: Date;

  @CreateDateColumn()
  createdAt: Date;

  // 🔒 IDENTIFICADOR MULTIUSUÁRIO:
  // Como não temos a tabela 'UserEntity', usamos uma coluna de texto simples.
  // Ela vai guardar o username de quem criou a venda (ex: 'dlucio').
  @Column({ nullable: true })
  usuario: string;
}