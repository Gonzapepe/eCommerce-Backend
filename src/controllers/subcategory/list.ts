import { Request, Response, NextFunction } from "express";

import { getRepository } from "typeorm";
import { CustomError } from "../../utils/response/custom-error/CustomError";
import { Subcategory } from "../../typeorm/entities/categories/Subcategory";
import { Product } from "../../typeorm/entities/products/Product";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const { name, category } = req.query;

  if (name) {
    const names = name.toString().split(",");
    console.log("NOMBRES: ", names);

    const products: Product[] = [];

    // names.forEach(async (product) => {
    //   const response = await getRepository(Product)
    //     .createQueryBuilder("product")
    //     .innerJoinAndSelect("product.subcategories", "subcategory")
    //     .where("subcategory.name = :name", { name: product })
    //     .getMany();
    //   products.push(...response);
    //   // console.log("RESPUESTA: ", response);
    //   // console.log("PRODUCTS DENTRO DE FOREACH: ", products);
    // });

    for (const x in names) {
      const response = await getRepository(Product)
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.images", "images")
        .innerJoin("product.subcategories", "subcategory")
        .where("subcategory.name = :name", { name: names[x] })
        .getMany();
      products.push(...response);
    }

    console.log("PRODUCTOS: ", products);
    res.customSuccess(200, "Productos: ", products);
  } else {
    try {
      const query = await getRepository(Subcategory)
        .createQueryBuilder("subcategory")
        .leftJoinAndSelect("subcategory.products", "subcategories");

      // If category exists then we add the where clause to the query
      if (category) {
        query.where("subcategory.category = :category", { category });
      }

      const subcategories = await query.getMany();
      if (!subcategories) {
        const customError = new CustomError(
          404,
          "General",
          "Subcategoría no encontradas",
          ["No encontrado"]
        );

        return next(customError);
      }

      res.customSuccess(200, "Subcategorías: ", subcategories);
    } catch (err) {
      const customError = new CustomError(400, "Raw", "Error", null, err);

      return next(customError);
    }
  }
};
