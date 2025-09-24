import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateImagenFieldLength1758212500000
  implements MigrationInterface
{
  name = 'UpdateImagenFieldLength1758212500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "producto" ALTER COLUMN "imagen" TYPE character varying(500)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "producto" ALTER COLUMN "imagen" TYPE character varying(50)`,
    );
  }
}



