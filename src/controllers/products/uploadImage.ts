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
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      let images_url: string[] = [];
      if (Array.isArray(files)) {
        images_url = files.map((image: any) => image.path);
      }
      const addedImages: any[] = [];
      if (images_url.length > 0) {
        for (let i = 0; i < images_url.length; i++) {
          const newImage = new Image();
          newImage.path = images_url[i];
          newImage.product = product;
          await Image.save(newImage);
          addedImages.push(newImage);
        }
      }
      console.log("FILE PATHS: ", images_url);

      res.customSuccess(200, "Imagen agregada satisfactoriamente", addedImages);
    } catch (err) {
      const customError = new CustomError(400, "Raw", "Error", null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
