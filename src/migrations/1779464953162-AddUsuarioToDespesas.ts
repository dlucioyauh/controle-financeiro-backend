import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsuarioToDespesas1779464953162 implements MigrationInterface {
    name = 'AddUsuarioToDespesas1779464953162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "despesas" ("id" SERIAL NOT NULL, "tipo" character varying NOT NULL, "descricao" character varying NOT NULL, "categoria" character varying NOT NULL, "valor" numeric NOT NULL, "formaPagamento" character varying NOT NULL, "data" TIMESTAMP NOT NULL, "usuario" character varying, CONSTRAINT "PK_e56af303d820f51a6e6a007b380" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "despesas"`);
    }

}
