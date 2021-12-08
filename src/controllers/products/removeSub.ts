import { Request, Response, NextFunction } from "express";

import { getConnection, createQueryBuilder } from "typeorm";
import { Product } from "../../typeorm/entities/products/Product";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const removeSub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, subId } = req.params;

  try {
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      const customError = new CustomError(
        404,
        "General",
        `Producto con el id ${id} no encontrado`,
        ["Producto no encontrado"]
      );
      return next(customError);
    }

    try {
      const deletedSub = await getConnection()
        .createQueryBuilder()
        .relation(Product, "subcategories")
        .of({ id })
        .remove({ id: subId });

      res.customSuccess(
        200,
        "Subcategoría eliminada satisfactoriamente.",
        deletedSub
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
