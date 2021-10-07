import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  Entity,
  OneToOne,
} from "typeorm";
import { CartItem } from "../cart/CartItems";

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

  @Column({ nullable: true })
  cartItemId!: string;

  @OneToOne(() => CartItem, (cartItem) => cartItem.product)
  @JoinColumn({ name: "cartItemId" })
  cartItem!: CartItem;
}
