import { Request, Response, NextFunction } from "express";
import validator from "validator";

import { ConstsUser } from "../../../consts/ConstsUser";
import { CustomError } from "../../../utils/response/custom-error/CustomError";
import { ErrorValidation } from "../../../utils/response/custom-error/types";

export const validatorRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { email, name, surname, phone, password, confirmPassword } = req.body;

  const errorsValidation: ErrorValidation[] = [];

  email = !email ? "" : email;
  name = !name ? "" : name;
  surname = !surname ? "" : surname;
  password = !password ? "" : password;
  confirmPassword = !confirmPassword ? "" : confirmPassword;
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

  // if (!validator.isInt(phone)) {
  //   errorsValidation.push({ phone: "El número de teléfono debe ser tipo Int" });
  // }

  // if (validator.isInt(document)) {
  //   errorsValidation.push({ document: "El documento debe ser tipo Int" });
  // }

  if (validator.isEmpty(password)) {
    errorsValidation.push({ password: "Contraseña requerida" });
  }

  if (!validator.isLength(password, { min: ConstsUser.PASSWORD_MIN_CHAR })) {
    errorsValidation.push({
      password: `La contraseña debe tener al menos ${ConstsUser.PASSWORD_MIN_CHAR} caracteres`,
    });
  }

  if (validator.isEmpty(confirmPassword)) {
    errorsValidation.push({
      passwordConfirm: "Confirmar la contraseña requerida",
    });
  }

  if (!validator.equals(password, confirmPassword)) {
    errorsValidation.push({
      passwordConfirm: "Las contraseñas deben ser iguales",
    });
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
