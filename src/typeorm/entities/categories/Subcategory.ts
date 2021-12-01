import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Entity,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Product } from "../products/Product";

@Entity()
export class Subcategory extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @ManyToMany(() => Product, (product) => product.subcategories, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinTable()
  products: Product[];
}
