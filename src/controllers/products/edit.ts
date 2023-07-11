import { Request, Response, NextFunction } from "express";

import { Product } from "../../typeorm/entities/products/Product";
import { CustomError } from "../../utils/response/custom-error/CustomError";
import { Image } from "../../typeorm/entities/images/Images";

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const { title, description, stock, price, features, category } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let images_url: string[] = [];
  if (Array.isArray(files)) {
    images_url = files.map((image: any) => image.path);
  }
  console.log("PATH DE IMAGENES: ", images_url);
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
      try {
        if (images_url.length > 0) {
          for (let i = 0; i < images_url.length; i++) {
            console.log("IMAGEN: ", images_url[i]);
            const newImage = new Image();
            newImage.path = images_url[i];
            newImage.product = product;
            await Image.save(newImage);
          }
        }
      } catch (err) {
        const customError = new CustomError(
          400,
          "Raw",
          `Error guardando imagenes`,
          null,
          err
        );

        return next(customError);
      }
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

    res.customSuccess(200, "Producto actualizado satisfactoriamente");
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
