import { Request, Response, NextFunction } from "express";

import { User } from "../../typeorm/entities/users/User";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, newPassword } = req.body;
  const { id, name } = req.jwtPayload;

  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      const customError = new CustomError(404, "General", "Not found", [
        `Usuario ${name} no encontrado`,
      ]);

      return next(customError);
    }

    if (!user.checkIfPasswordMatch(password)) {
      const customError = new CustomError(400, "General", "Not found", [
        "Contraseña incorrecta",
      ]);

      return next(customError);
    }

    user.password = newPassword;
    user.hashPassword();
    User.save(user);

    res.customSuccess(200, "Contraseña cambiada satisfactoriamente");
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
