import { Request, Response, NextFunction } from "express";

import { CartItem } from "../../typeorm/entities/cart/CartItems";
import { User } from "../../typeorm/entities/users/User";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { getConnection, getRepository } from "typeorm";

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.jwtPayload;
  const productId = req.params.id;

  try {
    const user = await User.findOne(id);
    if (!user) {
      const customError = new CustomError(404, "General", "Not Found", [
        `User with id:${id} doesn't exists.`,
      ]);
      return next(customError);
    }

    const cartItem = await getRepository(CartItem)
      .createQueryBuilder("cart_item")
      .leftJoinAndSelect("cart_item.product", "item")
      .where("cart_item.id = :id ", { id: productId })
      .getOne();
    if (!cartItem) {
      const customError = new CustomError(404, "General", "Not found", [
        `Producto con el id: ${productId} no existe`,
      ]);

      return next(customError);
    }
    // @see producto es indefinido. hay que hacer un left join and select para poder
    // retirar el precio del producto y asi poder hacer la suma del total.
    console.log(cartItem);
    console.log(cartItem);
    const total =
      Number(cartItem.product.price) * Number(cartItem.quantity.toFixed(2));
    // console.log(total, "TOTAL DEL CARRITO");
    try {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          update cart
              set total = total - $1
              where "id" = $2
      `,
          [parseFloat(total.toFixed(2)), user.cartId]
        );
      });
      await CartItem.delete(cartItem.id);
      res.customSuccess(
        200,
        "Producto eliminado satisfactoriamente.",
        cartItem
      );
    } catch (err) {
      const customError = new CustomError(400, "Raw", "Error", null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
