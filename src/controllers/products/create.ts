import { Request, Response, NextFunction } from "express";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { Product } from "../../typeorm/entities/products/Product";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, stock, price, features, description } = req.body;

  try {
    const product = await Product.findOne({ where: { title } });

    if (product) {
      const customError = new CustomError(
        400,
        "General",
        "El título del producto ya existe",
        [`El título ${product.title} ya existe`]
      );

      return next(customError);
    }
    try {
      const newProduct = new Product();

      newProduct.title = title;
      newProduct.stock = stock;
      newProduct.price = price;
      newProduct.features = features;
      newProduct.description = description;

      await Product.save(newProduct);

      res.customSuccess(200, "Producto publicado satisfactoriamente");
    } catch (err) {
      const customError = new CustomError(
        400,
        "Raw",
        `El producto '${title}' no pudo ser creado`,
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
