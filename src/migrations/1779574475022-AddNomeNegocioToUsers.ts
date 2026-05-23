import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNomeNegocioToUsers1779574475022 implements MigrationInterface {
  name = 'AddNomeNegocioToUsers1779574475022'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "nomeNegocio" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nomeNegocio"`);
  }
}
