import { Request, Response, NextFunction } from "express";
import { Product } from "../../typeorm/entities/products/Product";
import { Image } from "../../typeorm/entities/images/Images";
import { CustomError } from "../../utils/response/custom-error/CustomError";
import { getRepository } from "typeorm";

export const showImages = async (
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
      const image = await getRepository(Image)
        .createQueryBuilder("image")
        .leftJoin("image.product", "product")
        .where("product.id = :id", { id })
        .getMany();

      res.customSuccess(200, "imágenes encontradas", image);
    } catch (err) {
      const customError = new CustomError(400, "Raw", "Error", null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
