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
    const user = await User.findOne({ where: { id } });
    console.log("USUARIO", user);
    if (!user) {
      const customError = new CustomError(404, "General", "Not Found", [
        `User with id:${id} doesn't exists.`,
      ]);
      return next(customError);
    }

    const product = await CartItem.findOne({ where: { id: productId } });
    if (!product) {
      const customError = new CustomError(404, "General", "Not found", [
        `Producto con el id: ${productId} no existe`,
      ]);

      return next(customError);
    }
    await getConnection().transaction(async (tm) => {
      await tm.query(`
          update cart set total = 0
      `);
    });
    getRepository(CartItem).delete(productId);
    res.customSuccess(200, "Producto eliminado satisfactoriamente.", product);
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
