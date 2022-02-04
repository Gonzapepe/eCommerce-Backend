import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  Entity,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { CartItem } from "../cart/CartItems";
import { Subcategory } from "../categories/Subcategory";
import { Image } from "../images/Images";

type Category =
  | "muebles"
  | "pisos"
  | "sanitarios"
  | "cocina"
  | "accesorios"
  | "pinturas";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column("int", { default: 0 })
  stock!: number;

  @Column("decimal", { precision: 5, scale: 2 })
  price!: number;

  @Column("int", { default: 0 })
  features!: number;

  @Column({ default: "Este producto no tiene descripción." })
  description!: string;

  @Column({ default: "pinturas", nullable: true })
  category!: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  @JoinColumn({ name: "cartItemId" })
  cartItem!: CartItem[];

  @OneToMany(() => Image, (image) => image.product, { nullable: true })
  images!: Image[];

  @ManyToMany(() => Subcategory, (subcategory) => subcategory.products)
  subcategories: Subcategory[];
}
