import { Request, Response, NextFunction } from "express";

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
    const product = await Product.findOne(id);

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

      try {
        const newCartItem = new CartItem();

        newCartItem.product = product;
        newCartItem.cartId = user.cartId;
        newCartItem.cart = cart;
        newCartItem.quantity = quantity;

        cart.total =
          parseInt(cart.total as any) + newCartItem.product.price * quantity;
        for (var x of cart.cartItems) {
          if (newCartItem.product === x.product) {
            const customError = new CustomError(
              400,
              "General",
              "Item duplicado",
              ["Item duplicado"]
            );
            return next(customError);
          }
        }

        console.log("CARTITEMS: ", cart.cartItems);
        await CartItem.save(newCartItem);
        await Cart.save(cart);

        console.log(cart);
        res.customSuccess(
          200,
          "Producto añadido al carrito satisfactoriamente",
          newCartItem
        );
      } catch (err) {
        const customError = new CustomError(
          400,
          "Raw",
          `El producto del carrito no pudo ser guardado.`,
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
