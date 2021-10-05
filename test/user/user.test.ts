import "mocha";
import { expect } from "chai";
import { agent as request } from "supertest";
import { getRepository, Connection, Repository } from "typeorm";

import { app } from "../../src/index";
import { dbCreateConnection } from "../../src/typeorm/dbCreateConnection";
import { Role } from "../../src/typeorm/entities/users/types";
import { User } from "../../src/typeorm/entities/users/User";

describe("Users API", () => {
  let dbConnection: Connection;
  let userRepository: Repository<User>;

  const userPassword = "pass1";
  let adminUserToken: string = "";
  const adminUser = new User();

  adminUser.name = "Brandon";
  adminUser.surname = "Mayhew";
  adminUser.email = "bradonmayhew@test.com";
  adminUser.document = 44184897;
  adminUser.phone = 91142469624;
  adminUser.password = userPassword;
  adminUser.hashPassword();
  adminUser.role = "ADMINISTRATOR" as Role;

  let standardUserToken: string = "";
  const standardUser = new User();

  standardUser.name = "Todd";
  standardUser.surname = "Alquist";
  standardUser.email = "toddalquist@test.com";
  standardUser.document = 29127127;
  standardUser.phone = 91192458623;
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
      console.error("ERROR: ", err);
    }
  });

  beforeEach(async () => {
    await userRepository.save([adminUser, standardUser]);
    let res = await request(app)
      .post("/v1/auth/login")
      .send({ email: adminUser.email, password: userPassword });
    adminUserToken = res.body.data;
    res = await request(app)
      .post("/v1/auth/login")
      .send({ email: standardUser.email, password: userPassword });
    standardUserToken = res.body.data;
  });

  afterEach(async () => {
    await userRepository.delete([adminUser.id, standardUser.id]);
  });

  describe("GET /v1/users", () => {
    it("should get all users", async () => {
      const res = await request(app)
        .get("/v1/users")
        .set("Authorization", adminUserToken);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Lista de usuarios");
      expect(res.body.data[1].email).to.eql("pepsi@gmail.com");
    });

    it("should report error of unauthorized user", async () => {
      const res = await request(app)
        .get("/v1/users")
        .set("Authorization", standardUserToken);
      expect(res.status).to.equal(401);
      expect(res.body.errorType).to.equal("Unauthorized");
      expect(res.body.errorMessage).to.equal(
        "No autorizado - Derechos del usuario insuficientes"
      );
      expect(res.body.errors).to.eql([
        "No autorizado - Derechos del usuario insuficientes",
        "Rol actual: STANDARD. Rol requerido: ADMINISTRATOR",
      ]);
      expect(res.body.errorRaw).to.an("null");
      expect(res.body.errorsValidation).to.an("null");
    });
  });

  describe("GET /v1/users/:id", () => {
    it("should get user", async () => {
      const user = await userRepository.findOne({ email: adminUser.email });
      const res = await request(app)
        .get(`/v1/users/${user.id}`)
        .set("Authorization", adminUserToken);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Usuario encontrado");
      expect(res.body.data.email).to.eql(adminUser.email);
    });
  });
});
