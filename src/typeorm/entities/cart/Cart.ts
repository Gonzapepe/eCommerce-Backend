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

  @Column("decimal", { precision: 9, scale: 2, default: 0 })
  total!: number;
}
