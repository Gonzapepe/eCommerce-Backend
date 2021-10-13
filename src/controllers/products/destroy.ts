import { Request, Response, NextFunction } from "express";

import { Product } from "../../typeorm/entities/products/Product";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      const customError = new CustomError(404, "General", "Not found", [
        `Producto con el id: ${id} no existe.`,
      ]);

      return next(customError);
    }

    Product.delete(id);

    res.customSuccess(200, "Producto eliminado satisfactoriamente.", {
      id: product.id,
      title: product.title,
    });
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
