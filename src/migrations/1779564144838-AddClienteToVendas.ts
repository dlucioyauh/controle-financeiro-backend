import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClienteToVendas1779564144838 implements MigrationInterface {
    name = 'AddClienteToVendas1779564144838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendas" ADD "clienteId" character varying`);
        await queryRunner.query(`ALTER TABLE "vendas" ADD "clienteNome" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendas" DROP COLUMN "clienteNome"`);
        await queryRunner.query(`ALTER TABLE "vendas" DROP COLUMN "clienteId"`);
    }

}
