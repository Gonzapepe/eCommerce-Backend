import { response, Response } from "express";

response.customSuccess = function (
  httpStatusCode: number,
  message: string,
  data: any = null
): Response {
  return this.status(httpStatusCode).json({ message, data });
};

//@see this Will be used once we start with the development of the routes
