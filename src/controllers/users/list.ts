import { Request, Response, NextFunction } from "express";
import { User } from "../../typeorm/entities/users/User";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { getRepository } from "typeorm";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const page: number = parseInt(req.query.page as any) || 1;
  const perPage: number = parseInt(req.query.perpage as any) || 6;
  let total = 0;
  try {
    const query = await getRepository(User)
      .createQueryBuilder("users")
      .select([
        "users.id",
        "users.name",
        "users.email",
        "users.role",
        "users.cartId",
        "users.surname",
        "users.phone",
        "users.created_at",
        "users.updated_at",
      ]);

    const users = await query
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany();

    total = await query.getCount();

    if (!users) {
      const customError = new CustomError(
        404,
        "General",
        "Usuarios no encontradas",
        ["No encontrado"]
      );
      return next(customError);
    }
    res.customSuccess(200, "Lista de usuarios", {
      users,
      total,
      page,
      last_page: Math.ceil(total / perPage),
    });
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
