import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  Entity,
} from "typeorm";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column("int", { default: 0 })
  quantity!: number;

  @Column("decimal", { precision: 5, scale: 2 })
  price!: number;

  @Column("int", { default: 0 })
  features!: number;

  @Column({ default: "Este producto no tiene descripción." })
  description!: string;
}
