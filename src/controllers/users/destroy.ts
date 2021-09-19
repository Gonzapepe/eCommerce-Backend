import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { User } from "../../typeorm/entities/users/User";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      const customError = new CustomError(404, "General", "Not found", [
        `Usuario con el id: ${id} no existe.`,
      ]);
      return next(customError);
    }

    User.delete(id);

    res.customSuccess(200, "Usuario eliminado satisfactoriamente.", {
      id: user.id,
      name: user.name,
      surname: user.surname,
      dni: user.document,
      email: user.email,
    });
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
