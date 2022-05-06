import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../../typeorm/entities/users/User";
import { Cart } from "../../typeorm/entities/cart/Cart";

import { CustomError } from "../../utils/response/custom-error/CustomError";

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.jwtPayload.id;

  try {
    const user = await User.findOne(id);
    if (!user) {
      const customError = new CustomError(
        404,
        "General",
        `Usuario no encontrado`,
        ["Usuario no encontrado"]
      );
      return next(customError);
    }
    const cart = await getRepository(Cart)
      .createQueryBuilder("cart")
      .leftJoinAndSelect("cart.cartItems", "items")
      .leftJoinAndSelect("items.product", "products")
      .leftJoinAndSelect("products.images", "images")
      .where("cart.id = :id", { id: user.cartId })
      .getOne();

    if (!cart) {
      const customError = new CustomError(
        404,
        "General",
        `El carrito con el id: ${id} no fue encontrado.`,
        ["Carrito no encontrado"]
      );

      return next(customError);
    }
    res.customSuccess(200, "Carrito encontrado", cart);
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
