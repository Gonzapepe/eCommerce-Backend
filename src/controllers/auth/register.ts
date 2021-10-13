import { Request, Response, NextFunction } from "express";

import { User } from "../../typeorm/entities/users/User";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, surname, phone, document, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const customError = new CustomError(
        400,
        "General",
        "El usuario ya existe",
        [`El Email '${user.email}' ya existe`]
      );
      return next(customError);
    }

    try {
      const newUser = new User();
      newUser.email = email;
      newUser.name = name;
      newUser.surname = surname;
      newUser.phone = parseInt(phone);
      newUser.document = parseInt(document);
      newUser.password = password;
      newUser.hashPassword();

      await User.save(newUser);

      res.customSuccess(200, "Usuario creado satisfactoriamente", newUser);
    } catch (err) {
      const customError = new CustomError(
        400,
        "Raw",
        `Usuario '${email}' no puede ser creado`,
        null,
        err
      );

      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
