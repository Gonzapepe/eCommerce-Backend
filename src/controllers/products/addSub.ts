import { Request, Response, NextFunction } from "express";

import { Product } from "../../typeorm/entities/products/Product";
import { Subcategory } from "../../typeorm/entities/categories/Subcategory";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const addSub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const { subcategories } = req.body;

  try {
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      const customError = new CustomError(
        404,
        "General",
        `Producto con el id ${id} no fue encontrado.`,
        ["Producto no encontrado"]
      );
      return next(customError);
    }

    const subs: Subcategory[] = [];
    for (var x in subcategories) {
      let category = await Subcategory.findOne({
        where: { id: subcategories[0] },
      });
      if (!category) {
        const customError = new CustomError(
          404,
          "General",
          `Subcategoría ${x} no fue encontrada.`,
          ["Subcategoría no encontrada"]
        );
        return next(customError);
      }
      subs.push(category);
    }

    try {
      product.subcategories = [...subs];
      product.subcategories.map(async (subcategory) => {
        subcategory.countProducts();
        await Subcategory.save(subcategory);
      });
      await Product.save(product);
      res.customSuccess(
        200,
        "Subcategorías añadidas satisfactoriamente.",
        product
      );
    } catch (err) {
      const customError = new CustomError(400, "Raw", "Error", null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
