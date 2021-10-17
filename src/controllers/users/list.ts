import { Request, Response, NextFunction } from "express";
import { User } from "../../typeorm/entities/users/User";

import { CustomError } from "../../utils/response/custom-error/CustomError";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({
      select: [
        "id",
        "name",
        "email",
        "role",
        "cartId",
        "surname",
        "document",
        "phone",
        "created_at",
        "updated_at",
      ],
    });
    res.customSuccess(200, "Lista de usuarios", users);
  } catch (err) {
    const customError = new CustomError(
      400,
      "Raw",
      `No se puede recuperar la lista de usuarios.`,
      null,
      err
    );
    return next(customError);
  }
};
