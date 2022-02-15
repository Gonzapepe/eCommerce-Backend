import { Request, Response, NextFunction } from "express";
import { Image } from "../../typeorm/entities/images/Images";
import { Product } from "../../typeorm/entities/products/Product";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, imgId } = req.params;

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
      const image = await Image.findOne({ where: { id: imgId } });
      if (!image) {
        const customError = new CustomError(
          404,
          "General",
          `Imágen con el id ${imgId} no existe`,
          ["Imagen no encontrada"]
        );
        return next(customError);
      }

      await Image.remove(image);

      res.customSuccess(200, "Imagen eliminada satisfactoriamente", image);
    } catch (err) {
      const customError = new CustomError(400, "Raw", "Error", null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
