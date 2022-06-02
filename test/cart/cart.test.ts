import "mocha";
import { expect } from "chai";
import { agent as request } from "supertest";
import { getRepository, Connection, Repository } from "typeorm";

import { app } from "../../src";
import { dbCreateConnection } from "../../src/typeorm/dbCreateConnection";
import { Role } from "../../src/typeorm/entities/users/types";
import { User } from "../../src/typeorm/entities/users/User";
import { Cart } from "../../src/typeorm/entities/cart/Cart";

describe("Cart and CartItems API", () => {
  let dbConnection: Connection;
  //   let productRepository: Repository<Product>;
  let userRepository: Repository<User>;
  let cartRepository: Repository<Cart>;

  let userPassword = "pass1";
  let standardUserToken: string = "";
  const standardUser = new User();
  const cart = new Cart();

  standardUser.name = "asdasd";
  standardUser.surname = "Mayhew";
  standardUser.email = "eqweqweqw@test.com";
  standardUser.phone = 911444569624;
  standardUser.cart = cart;
  standardUser.password = userPassword;
  standardUser.hashPassword();
  standardUser.role = "STANDARD" as Role;
  cart.user = standardUser;

  before(async () => {
    dbConnection = await dbCreateConnection();
    userRepository = getRepository(User);
    cartRepository = getRepository(Cart);
  });

  after(async () => {
    try {
      await dbConnection.close();
    } catch (err) {
      console.log("ERROR", err);
    }
  });

  beforeEach(async () => {
    await userRepository.save(standardUser);
    await cartRepository.save(cart);
    let res = await request(app)
      .post("/v1/auth/login")
      .send({ email: standardUser.email, password: userPassword });
    standardUserToken = res.body.data;
  });

  afterEach(async () => {
    await userRepository.delete(standardUser.id);
  });

  describe("GET /v1/cart", () => {
    it("Should get user cart ", async () => {
      let res = await request(app)
        .get("/v1/cart")
        .set({ Authorization: standardUserToken });
      console.log("MENSAJEEE", res.body);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Carrito encontrado");
    });
  });

  describe("POST /v1/products/:id", () => {
    it("Should add product to cart", async () => {
      let res = await request(app)
        .post("/v1/products/6eeebba5-ce2e-4c90-9695-f35db2f9bc59")
        .set({ Authorization: standardUserToken })
        .send({ quantity: 1 });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(
        "Producto añadido al carrito satisfactoriamente"
      );
      expect(res.body.data.product.title).to.equal(
        "Pintura especial albatex rojo marinado"
      );
    });
  });
});
