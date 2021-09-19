import { Request, Response, NextFunction } from "express";
import { User } from "../../typeorm/entities/users/User";

import { CustomError } from "../../utils/response/custom-error/CustomError";

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const user = await User.findOne(id, {
      select: [
        "id",
        "name",
        "email",
        "role",
        "surname",
        "document",
        "phone",
        "created_at",
        "updated_at",
      ],
    });
    if (!user) {
      const customError = new CustomError(
        404,
        "General",
        `El usuario con el id: ${id} no fue encontrado.`,
        ["Usuario no encontrado"]
      );
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
