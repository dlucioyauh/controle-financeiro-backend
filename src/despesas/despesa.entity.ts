import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('despesas')
export class Despesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  @Column()
  descricao: string;

  @Column()
  categoria: string;

  @Column('decimal')
  valor: number;

  @Column()
  formaPagamento: string;

  @Column()
  data: Date;

  @Column({ nullable: true })
  usuario: string;
}