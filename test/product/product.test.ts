import "mocha";
import { expect } from "chai";
import { agent as request } from "supertest";
import { getRepository, Connection, Repository } from "typeorm";

import { app } from "../../src";
import { dbCreateConnection } from "../../src/typeorm/dbCreateConnection";
import { Product } from "../../src/typeorm/entities/products/Product";
import { Role } from "../../src/typeorm/entities/users/types";
import { User } from "../../src/typeorm/entities/users/User";

describe("Products API", () => {
  let dbConnection: Connection;
  let productRepository: Repository<Product>;
  let userRepository: Repository<User>;

  let userPassword = "pass1";
  let adminUserToken: string = "";
  const adminUser = new User();
  const product = new Product();

  adminUser.name = "asdasd";
  adminUser.surname = "Mayhew";
  adminUser.email = "eqweqweqw@test.com";
  adminUser.phone = 911444569624;
  adminUser.password = userPassword;
  adminUser.hashPassword();
  adminUser.role = "ADMINISTRATOR" as Role;

  product.title = "pintura naranja para piletas de azulejos";
  product.price = 150.0;

  before(async () => {
    dbConnection = await dbCreateConnection();
    userRepository = getRepository(User);
    productRepository = getRepository(Product);
  });

  after(async () => {
    try {
      await dbConnection.close();
    } catch (err) {
      console.log("ERROR: ", err);
    }
  });

  beforeEach(async () => {
    await userRepository.save(adminUser);
    let res = await request(app)
      .post("/v1/auth/login")
      .send({ email: adminUser.email, password: userPassword });
    adminUserToken = res.body.data;
  });

  afterEach(async () => {
    await userRepository.delete(adminUser.id);
  });

  describe("POST /v1/products", () => {
    it("should create a new product", async () => {
      let res = await request(app)
        .post("/v1/products")
        .set({ Authorization: adminUserToken })
        .send({
          title: product.title,
          price: product.price.toString(),
        });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(
        "Producto publicado satisfactoriamente"
      );
      expect(res.body.data).to.be.an("null");
      await productRepository.delete({ title: product.title });
    });

    it("should throw an error when title is duplicate", async () => {
      let res = await request(app)
        .post("/v1/products")
        .set({ Authorization: adminUserToken })
        .send({
          title: product.title,
          price: product.price.toString(),
        });
      res = await request(app)
        .post("/v1/products")
        .set({ Authorization: adminUserToken })
        .send({
          title: product.title,
          price: product.price.toString(),
        });
      expect(res.status).to.equal(400);
      expect(res.body.errorType).to.equal("General");
      expect(res.body.errorMessage).to.equal(
        "El título del producto ya existe"
      );
      expect(res.body.errors).to.eql([`El título ${product.title} ya existe`]);
      expect(res.body.errorRaw).to.an("null");
      expect(res.body.errorsValidation).to.an("null");
      await productRepository.delete({ title: product.title });
    });
  });

  describe("GET /v1/products", () => {
    it("should get a list of products", async () => {
      let res = await request(app).get("/v1/products");
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Lista de productos: ");
      expect(res.body.data[1].title).to.eql(
        "Pintura especial albatex rojo marinado"
      );
    });
  });

  describe("GET /v1/products/:id", () => {
    it("Should get a specific product", async () => {
      let res = await request(app).get(
        "/v1/products/6eeebba5-ce2e-4c90-9695-f35db2f9bc59"
      );
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Producto encontrado");
      expect(res.body.data.title).to.eql(
        "Pintura especial albatex rojo marinado"
      );
    });
    it("should throw an error putting the wrong id", async () => {
      let res = await request(app).get("/v1/products/asdasdaas");
      expect(res.status).to.equal(400);
      expect(res.body.errorType).to.equal("Raw");
      expect(res.body.errorMessage).to.equal("Error");
      expect(res.body.errors).to.be.an("null");
    });
  });

  describe("PATCH /v1/products/:id", () => {
    it("Should edit the stock of the product", async () => {
      let res = await request(app)
        .patch("/v1/products/6eeebba5-ce2e-4c90-9695-f35db2f9bc59")
        .set({ Authorization: adminUserToken })
        .send({ stock: 10 });
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(
        "Cambios del producto guardados satisfactoriamente"
      );
      expect(res.body.data).to.be.an("null");
    });
  });
});
