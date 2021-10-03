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

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems!: CartItem[];

  @Column({ nullable: true })
  userId!: string;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column("decimal", { precision: 5, scale: 2 })
  total!: number;
}
