import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOnboardingStepsToUsers1783000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'onboardingSteps',
        type: 'jsonb',
        isNullable: true,
        default: '{}',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'onboardingSteps');
  }
}