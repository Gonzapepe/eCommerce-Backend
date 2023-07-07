import { Request, Response, NextFunction } from "express";

import { getRepository } from "typeorm";
import { CustomError } from "../../utils/response/custom-error/CustomError";
import { Subcategory } from "../../typeorm/entities/categories/Subcategory";
import { Product } from "../../typeorm/entities/products/Product";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const { name, category } = req.query;
  const page: number = parseInt(req.query.page as any) || 1;
  const perPage: number = parseInt(req.query.perpage as any) || 6;
  let total = 0;

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
      const query = await getRepository(Subcategory).createQueryBuilder(
        "subcategory"
      );
      // If category exists then we add the where clause to the query
      if (category) {
        query.where("subcategory.category = :category", { category });
      }

      const subcategories = await query
        .skip((page - 1) * perPage)
        .take(perPage)
        .getMany();

      console.log("SUBCATEGORIES: ", subcategories);
      // Grabs the total of subcategories and counts it
      total = await query.getCount();

      if (!subcategories) {
        const customError = new CustomError(
          404,
          "General",
          "Subcategoría no encontradas",
          ["No encontrado"]
        );

        return next(customError);
      }

      res.customSuccess(200, "Subcategorías: ", {
        subcategories,
        total,
        page,
        last_page: Math.ceil(total / perPage),
      });
    } catch (err) {
      const customError = new CustomError(400, "Raw", "Error", null, err);

      return next(customError);
    }
  }
};
