import { Request, Response, NextFunction } from "express";
import { CartItem } from "../../typeorm/entities/cart/CartItems";

import { CustomError } from "../../utils/response/custom-error/CustomError";

export const showItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const cartItems = await CartItem.find({ where: { cartId: id } });
    if (!cartItems) {
      const customError = new CustomError(
        404,
        "General",
        "Items no encontrados.",
        ["Items no encontrados"]
      );
      return next(customError);
    }

    res.customSuccess(200, "Items del carrito", cartItems);
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
