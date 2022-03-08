import { Request, Response, NextFunction } from "express";

import { Role } from "../../typeorm/entities/users/types";
import { User } from "../../typeorm/entities/users/User";
import { JwtPayload } from "../../types/JwtPayload";
import { createJwtToken } from "../../utils/createJwtToken";
import { CustomError } from "../../utils/response/custom-error/CustomError";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    console.log("USUARIO: ", user);

    if (!user) {
      const customError = new CustomError(404, "General", "No encontrado", [
        "Email o contraseña incorrecta",
      ]);
      return next(customError);
    }

    if (!user.checkIfPasswordMatch(password)) {
      const customError = new CustomError(404, "General", "Not Found", [
        "Email o contraseña incorrecta",
      ]);

      return next(customError);
    }

    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      created_at: user.created_at,
    };
    try {
      const token = createJwtToken(jwtPayload);

      res.customSuccess(
        200,
        "Token creado satisfactoriamente.",
        {
          token: `Bearer ${token}`,
          user: jwtPayload
        }
      );
    } catch (err) {
      const customError = new CustomError(
        400,
        "Raw",
        "El token no pudo ser creado",
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
