import { Request, Response, NextFunction } from "express";

import { Role } from "../typeorm/entities/users/types";
import { CustomError } from "../utils/response/custom-error/CustomError";

export const checkRole = (roles: Role[], isSelfAllowed = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id, role } = req.jwtPayload;
    const { id: requestId } = req.params;

    console.log("REQUEST ID:", requestId);
    let errorSelfAllowed: string | null = null;
    if (isSelfAllowed) {
      if (id === requestId.toString()) {
        return next();
      }
      errorSelfAllowed = "Self allowed action.";
    }

    if (roles.indexOf(role) === -1) {
      const errors = [
        "No autorizado - Derechos del usuario insuficientes",
        `Rol actual: ${role}. Rol requerido: ${roles.toString()}`,
      ];
      if (errorSelfAllowed) {
        errors.push(errorSelfAllowed);
      }

      const customError = new CustomError(
        401,
        "Unauthorized",
        "No autorizado - Derechos del usuario insuficientes",
        errors
      );
      return next(customError);
    }
    return next();
  };
};
