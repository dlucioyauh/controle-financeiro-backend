import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertUsuarioToUUID1785365831688 implements MigrationInterface {
    name = 'ConvertUsuarioToUUID1785365831688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "trialRemindersEnabled" boolean NOT NULL DEFAULT true, "reportFrequency" character varying NOT NULL DEFAULT 'monthly', CONSTRAINT "REL_b6202d1cacc63a0b9c8dac2abd" UNIQUE ("userId"), CONSTRAINT "PK_e8cfb5b31af61cd363a6b6d7c25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "onboardingSteps" jsonb DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "bairro" character varying`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "cidade" character varying`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "usuario" character varying`);
        await queryRunner.query(`ALTER TABLE "vendas" ALTER COLUMN "dataVenda" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_email_unique"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "taxaFreteKm" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "taxaFreteKm" SET DEFAULT '0.8'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "plano" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "tema" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receitas" DROP COLUMN "rendimento"`);
        await queryRunner.query(`ALTER TABLE "receitas" ADD "rendimento" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "despesa" ALTER COLUMN "pessoal" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "despesa" ALTER COLUMN "tipo" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "nome"`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "nome" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "telefone"`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "telefone" character varying`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "endereco"`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "endereco" character varying`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_b6202d1cacc63a0b9c8dac2abd4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_b6202d1cacc63a0b9c8dac2abd4"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "endereco"`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "endereco" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "telefone"`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "telefone" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "nome"`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "nome" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "despesa" ALTER COLUMN "tipo" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "despesa" ALTER COLUMN "pessoal" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receitas" DROP COLUMN "rendimento"`);
        await queryRunner.query(`ALTER TABLE "receitas" ADD "rendimento" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "tema" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "plano" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "taxaFreteKm" SET DEFAULT 0.80`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "taxaFreteKm" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "vendas" ALTER COLUMN "dataVenda" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "usuario"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "cidade"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "bairro"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "onboardingSteps"`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "email" character varying(100)`);
        await queryRunner.query(`DROP TABLE "user_preferences"`);
    }

}
