import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1779410185509 implements MigrationInterface {
  name = 'InitialSchema1779410185509'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // no-op: Railway já tem o schema atualizado
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // no-op
  }
}
