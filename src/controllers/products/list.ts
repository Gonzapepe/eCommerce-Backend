import { Request, Response, NextFunction } from "express";
import { Product } from "../../typeorm/entities/products/Product";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { getRepository } from "typeorm";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const { category } = req.query;
  const page: number = parseInt(req.query.page as any) || 1;
  const perPage = parseInt(req.query.perpage as any) || 6;
  let total = 0;
  try {
    const products: Product[] = [];
    if (category) {
      const response = getRepository(Product).createQueryBuilder("product");
      const getProducts = await response
        .leftJoinAndSelect("product.subcategories", "products")
        .leftJoinAndSelect("product.images", "images")
        .where("product.category = :category", {
          category: category.toString().trim(),
        })
        .offset((page - 1) * perPage)
        .limit(perPage)
        .getMany();
      total = await response.getCount();
      products.push(...getProducts);
    } else {
      const response = getRepository(Product).createQueryBuilder("product");

      const getProducts = await response
        .leftJoinAndSelect("product.subcategories", "products")
        .leftJoinAndSelect("product.images", "images")
        .offset((page - 1) * perPage)
        .limit(perPage)
        .getMany();

      total = await response.getCount();

      products.push(...getProducts);
    }

    // asdiajsidoajoadsjasdadasda
    res.customSuccess(200, "Lista de productos: ", {
      products,
      total,
      page,
      last_page: Math.ceil(total / perPage),
    });
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
