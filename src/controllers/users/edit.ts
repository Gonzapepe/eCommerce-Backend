import { Request, Response, NextFunction } from "express";
import { User } from "../../typeorm/entities/users/User";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const { email, name, surname, phone } = req.body;

  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      const customError = new CustomError(
        404,
        "General",
        `Usuario con el id ${id} no fue encontrado.`,
        ["Usuario no encontrado"]
      );

      return next(customError);
    }
    user.email = email;
    user.name = name;
    user.surname = surname;
    user.phone = parseInt(phone);
    try {
      await User.save(user);
      res.customSuccess(
        200,
        "Cambios del usuario guardados satisfactoriamente"
      );
    } catch (err) {
      const customError = new CustomError(
        409,
        "Raw",
        `Usuario '${user.name} ${user.surname}' no puede ser guardado.`,
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
