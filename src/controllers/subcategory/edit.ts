import { Request, Response, NextFunction } from "express";
import { Subcategory } from "../../typeorm/entities/categories/Subcategory";

import { CustomError } from "../../utils/response/custom-error/CustomError";

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const { name, category } = req.body;

  try {
    const subcategory = await Subcategory.findOne({ where: { id } });

    if (!subcategory) {
      const customError = new CustomError(
        404,
        "General",
        `Subcategoría con el id ${id} no fue encontrado.`,
        ["Subcategoría no encontrada"]
      );

      return next(customError);
    }

    subcategory.name = name;
    subcategory.category = category;
    try {
      await Subcategory.save(subcategory);
      res.customSuccess(
        200,
        "Cambios de la subcategoría guardados satisfactoriamente"
      );
    } catch (err) {
      const customError = new CustomError(
        409,
        "Raw",
        `Subcategoría ${subcategory.name} no pudo ser guardado.`,
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
