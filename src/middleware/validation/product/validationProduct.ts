import { Request, Response, NextFunction } from "express";
import validator from "validator";

import { CustomError } from "../../../utils/response/custom-error/CustomError";
import { ErrorValidation } from "../../../utils/response/custom-error/types";

export const validatorProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { title, price } = req.body;

  const errorsValidation: ErrorValidation[] = [];

  title = !title ? "" : title;
  price = !price ? "" : price;

  if (validator.isEmpty(title)) {
    errorsValidation.push({ title: "Título requerido" });
  }

  if (validator.isEmpty(price)) {
    errorsValidation.push({ price: "Precio requerido" });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      "Validation",
      "Product validation error",
      null,
      null,
      errorsValidation
    );

    return next(customError);
  }

  return next();
};
