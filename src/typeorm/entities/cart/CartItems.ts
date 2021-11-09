import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  Entity,
} from "typeorm";

import { Cart } from "./Cart";
import { Product } from "../products/Product";

@Entity()
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  cartId!: string;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cartId" })
  cart!: Cart;

  @Column("int", { default: 0, nullable: true })
  quantity!: number;

  @ManyToOne(() => Product, (product) => product.cartItem)
  product: Product;
}
