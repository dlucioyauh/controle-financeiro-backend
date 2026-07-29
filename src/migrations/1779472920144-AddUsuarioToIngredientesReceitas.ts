import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsuarioToIngredientesReceitas1779472920144 implements MigrationInterface {
  name = 'AddUsuarioToIngredientesReceitas1779472920144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ---- Cria tabela 'ingredientes' se não existir ----
    const ingredientesExists = await queryRunner.hasTable('ingredientes');
    if (!ingredientesExists) {
      await queryRunner.query(`
        CREATE TABLE "ingredientes" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "nome" character varying NOT NULL,
          "precoCompra" numeric(10,2),
          "quantidadeCompra" numeric(10,2),
          "unidadeMedida" character varying,
          "usuario" character varying,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_ingredientes" PRIMARY KEY ("id")
        )
      `);
    }

    // ---- Cria tabela 'receitas' se não existir ----
    const receitasExists = await queryRunner.hasTable('receitas');
    if (!receitasExists) {
      await queryRunner.query(`
        CREATE TABLE "receitas" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "nome" character varying NOT NULL,
          "descricao" character varying,
          "usuario" character varying,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_receitas" PRIMARY KEY ("id")
        )
      `);
    }

    // ---- Adiciona colunas em 'ingredientes' (se não existirem) ----
    if (!(await queryRunner.hasColumn('ingredientes', 'preco'))) {
      await queryRunner.query(`ALTER TABLE "ingredientes" ADD "preco" numeric(10,2)`);
    }
    if (!(await queryRunner.hasColumn('ingredientes', 'unidade'))) {
      await queryRunner.query(`ALTER TABLE "ingredientes" ADD "unidade" character varying`);
    }

    // ---- Adiciona colunas em 'receitas' (se não existirem) ----
    if (!(await queryRunner.hasColumn('receitas', 'unidadeRendimento'))) {
      await queryRunner.query(`ALTER TABLE "receitas" ADD "unidadeRendimento" character varying`);
    }
    if (!(await queryRunner.hasColumn('receitas', 'custosFixosPorcentagem'))) {
      await queryRunner.query(`ALTER TABLE "receitas" ADD "custosFixosPorcentagem" numeric(10,2) NOT NULL DEFAULT '10'`);
    }
    if (!(await queryRunner.hasColumn('receitas', 'custoIngredientes'))) {
      await queryRunner.query(`ALTER TABLE "receitas" ADD "custoIngredientes" numeric(10,2) NOT NULL DEFAULT '0'`);
    }
    if (!(await queryRunner.hasColumn('receitas', 'precoVendaFinal'))) {
      await queryRunner.query(`ALTER TABLE "receitas" ADD "precoVendaFinal" numeric(10,2) NOT NULL DEFAULT '0'`);
    }
    if (!(await queryRunner.hasColumn('receitas', 'precoVendaParceiro'))) {
      await queryRunner.query(`ALTER TABLE "receitas" ADD "precoVendaParceiro" numeric(10,2) NOT NULL DEFAULT '0'`);
    }
    if (!(await queryRunner.hasColumn('receitas', 'ingredientes'))) {
      await queryRunner.query(`ALTER TABLE "receitas" ADD "ingredientes" jsonb`);
    }

    // ---- Ajusta colunas para aceitar NULL (se ainda não estiverem) ----
    await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "precoCompra" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "quantidadeCompra" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "unidadeMedida" DROP NOT NULL`);

    // ---- Remove a coluna 'lucroDesejado' (se existir) ----
    const hasLucro = await queryRunner.hasColumn('receitas', 'lucroDesejado');
    if (hasLucro) {
      await queryRunner.query(`ALTER TABLE "receitas" DROP COLUMN "lucroDesejado"`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverte as alterações (opcional)
    await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "unidadeMedida" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "quantidadeCompra" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "precoCompra" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "receitas" DROP COLUMN "ingredientes"`);
    await queryRunner.query(`ALTER TABLE "receitas" DROP COLUMN "precoVendaParceiro"`);
    await queryRunner.query(`ALTER TABLE "receitas" DROP COLUMN "precoVendaFinal"`);
    await queryRunner.query(`ALTER TABLE "receitas" DROP COLUMN "custoIngredientes"`);
    await queryRunner.query(`ALTER TABLE "receitas" DROP COLUMN "custosFixosPorcentagem"`);
    await queryRunner.query(`ALTER TABLE "receitas" DROP COLUMN "unidadeRendimento"`);
    await queryRunner.query(`ALTER TABLE "ingredientes" DROP COLUMN "unidade"`);
    await queryRunner.query(`ALTER TABLE "ingredientes" DROP COLUMN "preco"`);
    await queryRunner.query(`ALTER TABLE "receitas" ADD "lucroDesejado" numeric(5,2) NOT NULL DEFAULT '0'`);
  }
}