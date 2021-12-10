import { Request, Response, NextFunction } from "express";
import path from "path";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("guardando foto");
  console.log(req.body);

  res.customSuccess(200, "Imagen guardada");
};
