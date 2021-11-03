import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedPrecision1635898335579 implements MigrationInterface {
    name = 'AddedPrecision1635898335579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."cart" ALTER COLUMN "total" TYPE numeric(7,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."cart" ALTER COLUMN "total" TYPE numeric(5,2)`);
    }

}
