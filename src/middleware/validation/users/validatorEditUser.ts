import { Request, Response, NextFunction } from "express";
import validator from "validator";

import { ConstsUser } from "../../../consts/ConstsUser";
import { CustomError } from "../../../utils/response/custom-error/CustomError";
import { ErrorValidation } from "../../../utils/response/custom-error/types";

export const validatorEditUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { email, name, surname, phone } = req.body;

  const errorsValidation: ErrorValidation[] = [];

  email = !email ? "" : email;
  name = !name ? "" : name;
  surname = !surname ? "" : surname;
  phone = !phone ? "" : phone;

  const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
  const validatedPhone = phoneRegex.test(phone);

  if (!validator.isEmail(email)) {
    errorsValidation.push({ email: "El email es inválido" });
  }

  if (validator.isEmpty(email)) {
    errorsValidation.push({ email: "Email requerido" });
  }

  if (validator.isEmpty(name)) {
    errorsValidation.push({ name: "Nombre requerido" });
  }

  if (validator.isEmpty(surname)) {
    errorsValidation.push({ surname: "Apellido requerido" });
  }

  if (validator.isEmpty(phone)) {
    errorsValidation.push({ phone: "Número de teléfono requerido" });
  }

  if (validatedPhone === false) {
    errorsValidation.push({ phone: "Teléfono inválido" });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      "Validation",
      "Register validation error",
      null,
      null,
      errorsValidation
    );

    return next(customError);
  }

  return next();
};
