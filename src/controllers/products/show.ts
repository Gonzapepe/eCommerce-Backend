import { Request, Response, NextFunction } from "express";
import { Product } from "../../typeorm/entities/products/Product";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { getRepository } from "typeorm";

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const product = await getRepository(Product)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.subcategories", "products")
      .leftJoinAndSelect("product.images", "images")
      .where("product.id = :id", { id })
      .getOne();

    if (!product) {
      const customError = new CustomError(
        404,
        "General",
        `El producto con el id: ${id} no fue encontrado.`,
        ["Producto no encontrado"]
      );

      return next(customError);
    }

    res.customSuccess(200, "Producto encontrado", product);
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
