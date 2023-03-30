import { Request, Response, NextFunction } from "express";
import mercadopago from "mercadopago";
import { CustomError } from "../../utils/response/custom-error/CustomError";
import { User } from "../../typeorm/entities/users/User";
import { Cart } from "../../typeorm/entities/cart/Cart";
import { getConnection, getRepository } from "typeorm";
import { CartItem } from "../../typeorm/entities/cart/CartItems";
import { Product } from "../../typeorm/entities/products/Product";
import { Order } from "../../typeorm/entities/orders/Orders";

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

    const cart = await getRepository(Cart)
      .createQueryBuilder("cart")
      .leftJoinAndSelect("cart.cartItems", "items")
      .where("cart.id = :id", { id: user.cartId })
      .getOne();

    const order = new Order();

    order.total = cart.total;

    order.created_at = new Date();

    // Para hacer: 2 transacciones, la primera que elimine la cantidad de stock que tenia el cliente en el carrito en los determinados productos,
    // La segunda transaccion, que elimine el total del carrito del cliente
    getConnection().transaction(async (tm) => {
      await tm.query(
        `
        update cart
        set total = 0
        where "id" = $1
      `,
        [user.cartId]
      );
    });

    cart.cartItems.forEach(async (item) => {
      const response = await getRepository(CartItem)
        .createQueryBuilder("cartItem")
        .leftJoinAndSelect("cartItem.product", "items")
        .where("cartItem.id = :id", { id: item.id })
        .getOne();
      console.log("CART ITEM Y RELACIONES: ", response);
      const product = await Product.findOne({
        where: { id: response.product.id },
      });

      // Pusheamos el producto a la orden
      order.products.push(product);

      // Restamos el stock por la cantidad comprada
      product.stock = product.stock - item.quantity;

      await Product.save(product);
      console.log("PRODUCTO: ", product);
    });

    // Eliminar el item del carrito
    getConnection()
      .createQueryBuilder()
      .delete()
      .from(CartItem)
      .where("cartItem.cartid = :id", { id: user.cartId })
      .execute();

    const payment = await mercadopago.payment.findById(
      Number(req.query.payment_id)
    );

    // Guardamos la orden
    await Order.save(order);

    const status = payment.body.status;
    console.log("STATUS: ", status);
    // if (status === "approved") {
    // }
    res.customSuccess(200, "Pago acreditado", {
      Payment: req.query.payment_id,
      Status: status,
      MerchantOrder: req.query.merchant_order_id,
    });
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);

    return next(customError);
  }
};
