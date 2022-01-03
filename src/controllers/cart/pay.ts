import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { Cart } from "../../typeorm/entities/cart/Cart";
import { User } from "../../typeorm/entities/users/User";
import { CartItem } from "../../typeorm/entities/cart/CartItems";
import mercadopago from "mercadopago";

import { CustomError } from "../../utils/response/custom-error/CustomError";

export const pay = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.jwtPayload.id;
  try {
    const user = await User.findOne(id);
    if (!user) {
      const customError = new CustomError(
        404,
        "General",
        `Usuario no encontrado`,
        ["Usuario no encontrado"]
      );
      return next(customError);
    }

    const cart = await getRepository(Cart)
      .createQueryBuilder("cart")
      .leftJoinAndSelect("cart.cartItems", "items")
      .where("cart.id = :id", { id: user.cartId })
      .getOne();

    const preference = {
      items: [] as any[],
      back_urls: {
        success: "http://localhost:4000/feedback",
        failure: "http://localhost:4000/feedback",
        pending: "http://localhost:4000/feedback",
      },
    };

    for (const x in cart.cartItems) {
      const response = await getRepository(CartItem)
        .createQueryBuilder("cartItem")
        .leftJoinAndSelect("cartItem.product", "items")
        .where("cartItem.id = :id", { id: cart.cartItems[x].id })
        .getOne();
      console.log("RESPUESTA:", response);
      preference.items.push({
        id: response.product.id,
        title: response.product.title,
        currency_id: "ARS",
        description: response.product.description,
        quantity: response.quantity,
        unit_price: Number(response.product.price),
      });
    }

    // type Mp = "approved" | "all";

    // for (const x in products) {
    //   console.log("PRODUCTOS: ", products);
    //   preference.items.push({
    //     id: products[x.valueOf-1].product.id,
    //     title: products[x].product.title,
    //     currency_id: "ARS",
    //     description: products[x].product.description,
    //     quantity: products[x].quantity,
    //     unit_price: Number(products[x].product.price),
    //   });
    // }
    console.log("PREFERENCIA", preference);

    const response = await mercadopago.preferences.create(preference);
    const preferenceId = response.body.id;

    res.customSuccess(
      200,
      "Productos pagados satisfactoriamente",
      preferenceId
    );
  } catch (err) {
    const customError = new CustomError(400, "Raw", "Error", null, err);
    return next(customError);
  }
};
