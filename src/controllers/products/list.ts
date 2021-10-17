import { Request, Response, NextFunction } from "express";
import { Product } from "../../typeorm/entities/products/Product";

import { CustomError } from "../../utils/response/custom-error/CustomError";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();

    res.customSuccess(200, "Lista de productos: ", products);
  } catch (err) {
    const customError = new CustomError(
      400,
      "Raw",
      `No se pudo recuperar la lista de productos`,
      null,
      err
    );

    return next(customError);
  }
};