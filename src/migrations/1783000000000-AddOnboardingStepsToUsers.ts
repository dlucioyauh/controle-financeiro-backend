import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOnboardingStepsToUsers1783000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verifica se a coluna já existe (evita erro se já foi adicionada manualmente)
    const columnExists = await queryRunner.hasColumn('users', 'onboardingSteps');
    if (!columnExists) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'onboardingSteps',
          type: 'jsonb',
          isNullable: true,
          default: `'{}'::jsonb`, // sintaxe correta para PostgreSQL
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'onboardingSteps');
  }
}