import { Request, Response, NextFunction } from "express";

import { CustomError } from "../../utils/response/custom-error/CustomError";
import { Order } from "../../typeorm/entities/orders/Orders";

export const check = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const order = await Order.findOne(id);

    if (!order) {
      const customError = new CustomError(
        404,
        "General",
        "Order not found",
        [`Order with id: ${id} does not exist.`],
        null
      );
      return next(customError);
    }

    order.delivered_date = new Date();

    await Order.save(order);

    res.customSuccess(200, "Orden actualizada correctamente.", order);
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
