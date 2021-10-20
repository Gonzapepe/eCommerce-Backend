import { Request, Response, NextFunction } from "express";

import { CartItem } from "../../typeorm/entities/cart/CartItems";

import { CustomError } from "../../utils/response/custom-error/CustomError";

export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const productId: string = req.params.productId;
  try {
    const cartItem = await CartItem.findOne(productId);
    if (!cartItem) {
      const customError = new CustomError(
        404,
        "General",
        "Producto del carrito no encontrado",
        [`Producto con el id ${productId} no encontrado`]
      );

      return next(customError);
    }
    if (cartItem.cartId !== id) {
      const customError = new CustomError(
        404,
        "General",
        "Carrito no encontrado",
        [`Carrito con el id ${id} no encontrado`]
      );
      return next(customError);
    }
    CartItem.delete(productId);

    res.customSuccess(200, "Producto eliminado satisfactoriamente.", cartItem);
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
