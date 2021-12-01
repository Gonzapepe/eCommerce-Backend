import { Request, Response, NextFunction } from "express";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { Subcategory } from "../../typeorm/entities/categories/Subcategory";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    const subcategory = await Subcategory.findOne({ where: { name } });

    if (subcategory) {
      const customError = new CustomError(
        400,
        "General",
        "La subcategoría ya existe",
        [`La subcategoría ${subcategory.name} ya existe`]
      );
      return next(customError);
    }

    try {
      const newSubcategory = new Subcategory();

      newSubcategory.name = name;

      await Subcategory.save(newSubcategory);

      res.customSuccess(200, "Subcategoría creada satisfactoriamente");
    } catch (err) {
      const customError = new CustomError(
        400,
        "Raw",
        `La subcategoría '${name}' no puedo ser creada`,
        null,
        err
      );

      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
