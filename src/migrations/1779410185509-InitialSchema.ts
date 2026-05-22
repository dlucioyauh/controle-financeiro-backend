import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1779410185509 implements MigrationInterface {
    name = 'InitialSchema1779410185509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receitas" DROP COLUMN "lucroDesejado"`);
        await queryRunner.query(`ALTER TABLE "receitas" ALTER COLUMN "custosFixosPorcentagem" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receitas" ALTER COLUMN "custoIngredientes" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receitas" ALTER COLUMN "precoVendaFinal" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receitas" ALTER COLUMN "precoVendaParceiro" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "precoCompra" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "quantidadeCompra" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "unidadeMedida" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "unidadeMedida" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "quantidadeCompra" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredientes" ALTER COLUMN "precoCompra" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receitas" ALTER COLUMN "precoVendaParceiro" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receitas" ALTER COLUMN "precoVendaFinal" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receitas" ALTER COLUMN "custoIngredientes" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receitas" ALTER COLUMN "custosFixosPorcentagem" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receitas" ADD "lucroDesejado" numeric(5,2) NOT NULL DEFAULT '0'`);
    }

}
