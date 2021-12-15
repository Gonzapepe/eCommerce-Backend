import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Entity,
  ManyToOne,
} from "typeorm";
import { Product } from "../products/Product";

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ default: "uploads\\default.png" })
  path!: string;

  @ManyToOne(() => Product, (product) => product.images, { nullable: true })
  product!: Product;
}
