import { Request, Response, NextFunction } from "express";
import { getConnection, getRepository } from "typeorm";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { Product } from "../../typeorm/entities/products/Product";
import { CartItem } from "../../typeorm/entities/cart/CartItems";
import { User } from "../../typeorm/entities/users/User";
import { Cart } from "../../typeorm/entities/cart/Cart";

export const add = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const userId = req.jwtPayload.id;
  const { quantity } = req.body;

  try {
    const product = await getRepository(Product)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.images", "images")
      .where("product.id = :id", { id })
      .getOne();

    if (!product) {
      const customError = new CustomError(
        404,
        "General",
        `Producto con el id ${id} no fue encontrado.`,
        ["Producto no encontrado"]
      );

      return next(customError);
    }
    if (quantity > product.stock) {
      const customError = new CustomError(
        400,
        "General",
        `No hay stock suficiente.`,
        ["Stock insuficiente"]
      );
      return next(customError);
    }
    try {
      const user = await User.findOne(userId);
      if (!user) {
        const customError = new CustomError(
          404,
          "General",
          `Usuario con el id ${id} no fue encontrado.`,
          ["Usuario no encontrado"]
        );
        return next(customError);
      }
      const cart = await Cart.findOne(user.cartId);
      const total =
        Number(cart.total) +
        Number(product.price) * Number(quantity.toFixed(2));
      try {
        const newCartItem = new CartItem();

        newCartItem.product = product;
        newCartItem.cart = cart;
        newCartItem.quantity = quantity;
        console.log(newCartItem.product);
        await CartItem.save(newCartItem);
        try {
          const items: CartItem[] = [];
          items.unshift(newCartItem);
          await getConnection().transaction(async (tm) => {
            await tm.query(
              `
              update cart
              set total = $1
              where "id" = $2
            `,
              [parseFloat(total.toFixed(2)), cart.id]
            );
          });

          res.customSuccess(
            200,
            "Producto añadido al carrito satisfactoriamente",
            newCartItem
          );
        } catch (err) {
          const customError = new CustomError(
            400,
            "Raw",
            "El producto del carrito no pudo ser guardado."
          );
          return next(customError);
        }
      } catch (err) {
        const customError = new CustomError(
          400,
          "Raw",
          `El producto no pudo ser añadido.`,
          null,
          err
        );

        return next(customError);
      }
    } catch (err) {
      const customError = new CustomError(400, "Raw", "Error", null, err);

      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
