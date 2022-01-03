import { Request, Response, NextFunction } from "express";
import mercadopago from "mercadopago";

export const feedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payment = await mercadopago.payment.findById(
    Number(req.query.payment_id)
  );
  const merchantOrder = await mercadopago.merchant_orders.findById(
    payment.body.order.id
  );
  const preferenceId = merchantOrder.body.preference_id;
  const status = payment.body.status;

  console.log("PAYMENT: ", payment);
  console.log("PREFERENCE ID: ", preferenceId);
  res.json({ 
      Payment: req.query.payment_id,
      Status: req.query.status,
      MerchantOrder: req.query.merchant_order_id
  })
};
