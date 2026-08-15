import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClienteToVendas1779564144838 implements MigrationInterface {
  name = 'AddClienteToVendas1779564144838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verifica se a tabela 'vendas' existe
    const tableExists = await queryRunner.hasTable('vendas');
    if (!tableExists) {
      // Cria a tabela 'vendas' com as colunas básicas
      await queryRunner.query(`
        CREATE TABLE "vendas" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "dataVenda" TIMESTAMP NOT NULL DEFAULT now(),
          "valorTotal" numeric(10,2) NOT NULL,
          "produto" character varying NOT NULL,
          "quantidade" numeric(10,2) DEFAULT 1,
          "canalVenda" character varying,
          "clienteNome" character varying,
          "usuario" character varying NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_vendas" PRIMARY KEY ("id")
        )
      `);
    }

    // Agora adiciona a coluna 'clienteId' se não existir
    const columnExists = await queryRunner.hasColumn('vendas', 'clienteId');
    if (!columnExists) {
      await queryRunner.query(`ALTER TABLE "vendas" ADD "clienteId" character varying`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove a coluna 'clienteId' se existir
    const columnExists = await queryRunner.hasColumn('vendas', 'clienteId');
    if (columnExists) {
      await queryRunner.query(`ALTER TABLE "vendas" DROP COLUMN "clienteId"`);
    }
    // Não deletamos a tabela 'vendas' no down para evitar perda de dados,
    // mas podemos deixar como está.
  }
}