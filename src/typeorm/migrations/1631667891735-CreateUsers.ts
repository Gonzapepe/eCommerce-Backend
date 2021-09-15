import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsers1631667891735 implements MigrationInterface {
    name = 'CreateUsers1631667891735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "surname" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "surname"`);
    }

}
