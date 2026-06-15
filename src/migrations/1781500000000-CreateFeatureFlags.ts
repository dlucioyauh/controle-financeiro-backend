import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFeatureFlags1781500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'feature_flags',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'enabled',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
      true,
    );

    // Insere flags padrão
    await queryRunner.query(`
      INSERT INTO feature_flags (name, description, enabled) VALUES
      ('dashboard_pessoal', 'Habilita o toggle Empresa/Pessoal no Dashboard', true),
      ('novo_relatorio', 'Ativa novo formato de relatório em PDF', false),
      ('dark_mode', 'Permite alternar entre tema claro/escuro (em breve)', false)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('feature_flags');
  }
}