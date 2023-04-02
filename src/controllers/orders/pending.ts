import { Request, Response, NextFunction } from "express";
import { Order } from "../../typeorm/entities/orders/Orders";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { getRepository } from "typeorm";

export const pending = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page: number = parseInt(req.query.page as any) || 1;
  const perPage: number = parseInt(req.query.perpage as any) || 6;
  let total = 0;
  try {
    const orders: Order[] = [];
    const response = getRepository(Order).createQueryBuilder("order");

    // Seleccionamos el usuario, y los productos relacionados a la orden
    const getOrders = await response
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.products", "products")
      .where("order.delivered_date IS NULL")
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany();
    total = await response.where("order.delivered_date IS NULL").getCount();
    orders.push(...getOrders);

    // Devuelve un JSON con las ordenes, el total de la cantidad de las ordenes,
    // las paginas y la última página
    res.customSuccess(200, "Lista de ordenes pendientes: ", {
      orders,
      total,
      page,
      last_page: Math.ceil(total / perPage),
    });
  } catch (err) {
    const customError = new CustomError(
      400,
      "Raw",
      `No se pudo recuperar la lista de productos`,
      null,
      err
    );
    return next(customError);
  }
};
