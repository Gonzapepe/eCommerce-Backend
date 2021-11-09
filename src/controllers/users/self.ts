import { Request, Response, NextFunction } from "express";
import { User } from "../../typeorm/entities/users/User";

import { CustomError } from "../../utils/response/custom-error/CustomError";

import { getRepository } from "typeorm";

export const self = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.jwtPayload;
  try {
    const user = await getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :id", { id })
      .getOne();
    if (!user) {
      const customError = new CustomError(
        404,
        "General",
        `El usuario con el id: ${id} no fue encontrado.`,
        ["Usuario no encontrado"]
      );
      return next(customError);
    }

    res.customSuccess(200, "Usuario encontrado", user);
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
