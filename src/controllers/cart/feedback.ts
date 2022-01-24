import { Request, Response, NextFunction } from "express";
import mercadopago from "mercadopago";
import { CustomError } from "../../utils/response/custom-error/CustomError";
import { User } from "../../typeorm/entities/users/User";
import { Cart } from "../../typeorm/entities/cart/Cart";
import { getConnection } from "typeorm";
import { CartItem } from "../../typeorm/entities/cart/CartItems";

export const feedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.jwtPayload;

  try {
    const user = await User.findOne(id);
    if (!user) {
      const customError = new CustomError(
        404,
        "General",
        "Usuario no encontrado",
        ["Usuario no encontrado"]
      );

      return next(customError);
    }

    console.log("USUARIO: ", user);

    // Para hacer: 2 transacciones, la primera que elimine la cantidad de stock que tenia el cliente en el carrito en los determinados productos,
    // La segunda transaccion, que elimine el total del carrito del cliente

    // Eliminar el item del carrito
    // const deletedCartItems = getConnection().createQueryBuilder().delete().from(CartItem).where('cartItem.cartid = :id', {id: user.cartId}).execute()

    const payment = await mercadopago.payment.findById(
      Number(req.query.payment_id)
    );
    const merchantOrder = await mercadopago.merchant_orders.findById(
      payment.body.order.id
    );
    const preferenceId = merchantOrder.body.preference_id;
    const status = payment.body.status;
    if (status === "approved") {
    }
    console.log("PREFERENCE ID: ", preferenceId);
    res.customSuccess(200, "Pago acreditado", {
      Payment: req.query.payment_id,
      Status: req.query.status,
      MerchantOrder: req.query.merchant_order_id,
    });
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
