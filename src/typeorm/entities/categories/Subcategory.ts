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

type Category =
  | "muebles"
  | "pisos"
  | "sanitarios"
  | "cocina"
  | "accesorios"
  | "pinturas";

@Entity()
export class Subcategory extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ default: 0 })
  count!: number;

  @Column({ default: "pinturas", nullable: true })
  category!: Category;

  @ManyToMany(() => Product, (product) => product.subcategories, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinTable()
  products: Product[];

  countProducts() {
    this.count = this.products.length;
  }
}
