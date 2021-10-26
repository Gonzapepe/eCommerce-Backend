import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Entity,
} from "typeorm";

import { CartItem } from "./CartItems";
import { User } from "../users/User";

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { nullable: true })
  cartItems!: CartItem[];

  @OneToOne(() => User, (user) => user.cart, { nullable: true })
  user!: User;

  @Column("decimal", { precision: 5, scale: 2, default: 0 })
  total!: number;

  getTotal() {
    let total = this.cartItems.map(
      (cartItem) => cartItem.product.price * cartItem.quantity
    );

    this.total = total.reduce((a, b) => a + b, 0);
  }
}
