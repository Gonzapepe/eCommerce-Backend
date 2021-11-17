import "mocha";
import { expect } from "chai";
import { agent as request } from "supertest";
import { getRepository, Connection, Repository } from "typeorm";

import { app } from "../../src";
import { dbCreateConnection } from "../../src/typeorm/dbCreateConnection";
import { Product } from "../../src/typeorm/entities/products/Product";
import { Role } from "../../src/typeorm/entities/users/types";
import { User } from "../../src/typeorm/entities/users/User";

describe("Cart and CartItems API", () => {
  let dbConnection: Connection;
  //   let productRepository: Repository<Product>;
  let userRepository: Repository<User>;

  let userPassword = "pass1";
  let standardUserToken: string = "";
  const standardUser = new User();

  standardUser.name = "asdasd";
  standardUser.surname = "Mayhew";
  standardUser.email = "eqweqweqw@test.com";
  standardUser.document = 42884897;
  standardUser.phone = 911444569624;
  standardUser.password = userPassword;
  standardUser.hashPassword();
  standardUser.role = "STANDARD" as Role;

  before(async () => {
    dbConnection = await dbCreateConnection();
    userRepository = getRepository(User);
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
    });
  });
});
