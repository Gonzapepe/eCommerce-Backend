import { Role } from "../typeorm/entities/users/types";

export type JwtPayload = {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: Date;
};
