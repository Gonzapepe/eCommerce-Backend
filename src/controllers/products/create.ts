import { Request, Response, NextFunction } from "express";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { Product } from "../../typeorm/entities/products/Product";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, stock, price, features, description } = req.body;
};
