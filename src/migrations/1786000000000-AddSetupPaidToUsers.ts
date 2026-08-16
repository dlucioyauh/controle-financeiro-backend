import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSetupPaidToUsers1786000000000 implements MigrationInterface {
  name = 'AddSetupPaidToUsers1786000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "setupPaid" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "setupPaid"`);
  }
}