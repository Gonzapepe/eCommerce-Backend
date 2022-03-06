import { Request, Response, NextFunction } from "express";

import { Product } from "../../typeorm/entities/products/Product";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const { title, description, stock, price, features, category } = req.body;
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

    product.title = title;
    product.description = description;
    product.stock = stock;
    product.price = price;
    product.features = features;
    product.category = category;

    try {
      await Product.save(product);
      res.customSuccess(
        200,
        "Cambios del producto guardados satisfactoriamente"
      );
    } catch (err) {
      const customError = new CustomError(
        409,
        "Raw",
        `Producto ${product.title} no puede ser guardado.`,
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
