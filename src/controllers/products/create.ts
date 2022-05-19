import { Request, Response, NextFunction } from "express";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { Product } from "../../typeorm/entities/products/Product";
import { Image } from "../../typeorm/entities/images/Images";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, stock, price, features, description, category } = req.body;

  console.log("REQ BODY: ", req.body);
  console.log("REQ FILES: ", req.file);
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
      newProduct.stock = parseInt(stock);
      newProduct.price = price.toString();
      newProduct.features = features;
      newProduct.category = category;
      newProduct.description = description;

      await Product.save(newProduct);

      try {
        const newImage = new Image();
        newImage.path = req.file.path;
        newImage.product = newProduct;

        await Image.save(newImage);

        res.customSuccess(
          200,
          "Producto publicado satisfactoriamente",
          newProduct
        );
      } catch (err) {
        const customError = new CustomError(400, "Raw", "Error", null, err);

        return next(customError);
      }
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
