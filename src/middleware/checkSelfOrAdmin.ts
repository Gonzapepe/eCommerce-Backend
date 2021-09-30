import { Request, Response, NextFunction } from "express";

import { Role } from "../typeorm/entities/users/types";
import { CustomError } from "../utils/response/custom-error/CustomError";

export const checkSelfOrAdmin = (roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id, role } = req.jwtPayload;
    const { id: requestId } = req.params;
    let allowed: boolean | null = null;
    console.log("ROL DEL USUARIO: ", roles.toString());
    if (id === requestId || role === roles.toString()) {
      allowed = true;
    }
    if (!allowed) {
      const customError = new CustomError(
        401,
        "Unauthorized",
        "No estás autorizado",
        null
      );

      return next(customError);
    }
    return next();
  };
};
