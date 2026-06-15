import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsuarioToIngredientesReceitas1779472920144 implements MigrationInterface {
    name = 'AddUsuarioToIngredientesReceitas1779472920144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adiciona colunas apenas se não existirem
        if (!(await queryRunner.hasColumn('ingredientes', 'preco'))) {
            await queryRunner.query(`ALTER TABLE "ingredientes" ADD "preco" numeric(10,2)`);
        }
        if (!(await queryRunner.hasColumn('ingredientes', 'unidade'))) {
            await queryRunner.query(`ALTER TABLE "ingredientes" ADD "unidade" character varying`);
        }
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

        // Garante que as colunas sejam nullable (caso ainda não estejam)
        await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "precoCompra" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "quantidadeCompra" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "unidadeMedida" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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