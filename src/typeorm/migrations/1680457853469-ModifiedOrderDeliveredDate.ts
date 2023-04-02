import {MigrationInterface, QueryRunner} from "typeorm";

export class ModifiedOrderDeliveredDate1680457853469 implements MigrationInterface {
    name = 'ModifiedOrderDeliveredDate1680457853469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."order" ALTER COLUMN "delivered_date" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."order" ALTER COLUMN "delivered_date" SET NOT NULL`);
    }

}
