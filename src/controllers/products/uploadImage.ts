import { Request, Response, NextFunction } from "express";
import { Image } from "../../typeorm/entities/images/Images";
import { Product } from "../../typeorm/entities/products/Product";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne(id);

    if (!product) {
      const customError = new CustomError(
        404,
        "General",
        `Producto con el id ${id} no existe`,
        ["Producto no encontrado"],
        null
      );
      return next(customError);
    }

    try {
      const newImage = new Image();
      newImage.path = req.file.path;
      newImage.product = product;

      await Image.save(newImage);

      res.customSuccess(200, "Imagen agregada satisfactoriamente", newImage);
    } catch (err) {
      const customError = new CustomError(400, "Raw", "Error", null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
