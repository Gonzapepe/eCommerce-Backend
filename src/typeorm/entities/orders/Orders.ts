import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "../products/Product";
import { User } from "../users/User";

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  // @Column()
  // items!: Product[];

  @Column("decimal", { precision: 9, scale: 2, default: 0 })
  total!: number;

  @Column()
  delivered_date: Date;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: "CASCADE",
  })
  user!: User;

  @ManyToMany(() => Product, (product) => product.orders)
  products!: Product[];

  @Column()
  @CreateDateColumn()
  created_at?: Date;

  @Column()
  @UpdateDateColumn()
  updated_at?: Date;
}
