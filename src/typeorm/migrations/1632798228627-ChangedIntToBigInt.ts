import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedIntToBigInt1632798228627 implements MigrationInterface {
    name = 'ChangedIntToBigInt1632798228627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "phone" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "phone" integer NOT NULL`);
    }

}
