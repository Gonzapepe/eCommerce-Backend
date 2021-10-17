import { Request, Response, NextFunction } from "express";
import { Cart } from "../../typeorm/entities/cart/Cart";

import { CustomError } from "../../utils/response/custom-error/CustomError";

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const cart = await Cart.findOne(id);

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
