import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTutorAddresses1790000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tutor_addresses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk_tutor_addresses',
          },
          {
            name: 'tutor_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '8',
            isNullable: false,
          },
          {
            name: 'street',
            type: 'varchar',
            length: '120',
            isNullable: false,
          },
          {
            name: 'number',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'complement',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'district',
            type: 'varchar',
            length: '80',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '80',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'char',
            length: '2',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'fk_tutor_addresses_tutor_id',
            columnNames: ['tutor_id'],
            referencedTableName: 'tutors',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'tutor_addresses',
      new TableIndex({
        name: 'idx_tutor_addresses_tutor_id',
        columnNames: ['tutor_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tutor_addresses');
  }
}
