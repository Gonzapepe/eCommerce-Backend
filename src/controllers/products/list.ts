import { Request, Response, NextFunction } from "express";
import { Product } from "../../typeorm/entities/products/Product";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { createQueryBuilder, getRepository } from "typeorm";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const { category } = req.query;
  try {
    const products: Product[] = [];
    if (category) {
      const response = await getRepository(Product)
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.subcategories", "products")
        .leftJoinAndSelect("product.images", "images")
        .where("product.category = :category", {
          category: category.toString().trim(),
        })
        .getMany();
      products.push(...response);
    } else {
      const response = await getRepository(Product)
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.subcategories", "products")
        .leftJoinAndSelect("product.images", "images")
        .getMany();
      products.push(...response);
    }

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
