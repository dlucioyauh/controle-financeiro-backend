import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCamposAdicionaisToUsers1779736241293 implements MigrationInterface {
  name = 'AddCamposAdicionaisToUsers1779736241293'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "nome" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "telefone" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "nome"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "email"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "telefone"`);
  }
}


