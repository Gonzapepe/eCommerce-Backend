import { Request, Response, NextFunction } from "express";

import { getRepository } from "typeorm";
import { CustomError } from "../../utils/response/custom-error/CustomError";
import { Subcategory } from "../../typeorm/entities/categories/Subcategory";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subcategories = await getRepository(Subcategory)
      .createQueryBuilder("subcategory")
      .leftJoinAndSelect("subcategory.products", "subcategories")
      .addSelect("subcategory.countProducts()", "count")
      .getMany();

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
};
