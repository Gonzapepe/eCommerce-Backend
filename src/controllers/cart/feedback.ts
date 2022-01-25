import { Request, Response, NextFunction } from "express";
import mercadopago from "mercadopago";
import { CustomError } from "../../utils/response/custom-error/CustomError";
import { User } from "../../typeorm/entities/users/User";
import { getConnection } from "typeorm";
import { CartItem } from "../../typeorm/entities/cart/CartItems";
import { Cart } from "../../typeorm/entities/cart/Cart";

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
    const cart = await Cart.findOne(user.cartId);

    console.log("USUARIO: ", user);

    // Para hacer: 2 transacciones, la primera que elimine la cantidad de stock que tenia el cliente en el carrito en los determinados productos,
    // La segunda transaccion, que elimine el total del carrito del cliente

    try {
      await getConnection().transaction(async (tm) => {
        //resetear el total a 0
        await tm.query(
          `
          update cart 
          set total = 0
          where "id" = $1
        `,
          [user.cartId]
        );

        // eliminar stock del producto (falta probarlo)
        for (const x in cart.cartItems) {
          await tm.query(
            `
        update product
        set stock = stock - $1
        where "id" = $2
      `[
              (Number(cart.cartItems[x].quantity),
              cart.cartItems[x].product.id as any)
            ]
          );
        }
      });

      // Resetea el Array de cartItems donde el Id sea igual que el id del carrito
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(CartItem)
        .where("cartId = :id", { id: user.cartId })
        .execute();

      console.log("USUARIO DESPUES DE LA QUERY: ", user.cart.total);
    } catch (err) {
      const customError = new CustomError(400, "Raw", "Error", null, err);
      return next(customError);
    }

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
