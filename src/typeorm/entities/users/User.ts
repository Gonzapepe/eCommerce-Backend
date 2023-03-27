import bcrypt from "bcryptjs";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Cart } from "../cart/Cart";
import { Role } from "./types";
import { Order } from "../orders/Orders";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column()
  surname!: string;

  @Column("bigint")
  phone!: number;

  @Column({ default: "STANDARD" as Role, length: 30 })
  role!: string;

  @Column({ nullable: true })
  cartId: string;

  @OneToOne(() => Cart, (cart) => cart.user, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cartId" })
  cart!: Cart;

  @OneToMany(() => Order, (order) => order.user, {
    nullable: true,
    onDelete: "CASCADE",
  })
  orders!: Order[];

  @Column()
  @CreateDateColumn()
  created_at?: Date;

  @Column()
  @UpdateDateColumn()
  updated_at?: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfPasswordMatch(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
