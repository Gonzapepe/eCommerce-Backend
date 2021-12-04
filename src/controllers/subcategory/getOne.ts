import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { Subcategory } from "../../typeorm/entities/categories/Subcategory";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const subcategory = await getRepository(Subcategory)
      .createQueryBuilder("subcategory")
      .leftJoinAndSelect("subcategory.products", "items")
      .where("subcategory.id = :id", { id })
      .getOne();

    subcategory.countProducts();

    if (!subcategory) {
      const customError = new CustomError(
        404,
        "General",
        `Subcategoría con el id ${id} no encontrada`,
        ["Subcategoría no encontrada"]
      );
      return next(customError);
    }

    res.customSuccess(200, "Subcategoría encontrada: ", subcategory);
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
