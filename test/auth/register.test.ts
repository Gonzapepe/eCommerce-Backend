import "mocha";
import { expect } from "chai";
import { agent as request } from "supertest";
import { getRepository, Connection, Repository } from "typeorm";

import { app } from "../../src/index";
import { dbCreateConnection } from "../../src/typeorm/dbCreateConnection";
import { User } from "../../src/typeorm/entities/users/User";

describe("POST /v1/auth/register", () => {
  let dbConnection: Connection;
  let userRepository: Repository<User>;

  const userPassword = "password";
  const user = new User();

  user.email = "brandon.mayhew@test.com";
  user.name = "brandon";
  user.surname = "Mayhew";
  user.document = parseInt("1572864");
  user.phone = parseInt("91145682345");
  user.password = userPassword;
  user.hashPassword();

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

  it("should register a new user", async () => {
    const res = await request(app).post("/v1/auth/register").send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      document: user.document,
      phone: user.phone,
      password: userPassword,
      confirmPassword: userPassword,
    });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Usuario creado satisfactoriamente");
    expect(res.body.data).to.be.an("null");
    await userRepository.delete({ email: user.email });
  });

  it("should report error when email already exists", async () => {
    let res = await request(app).post("/v1/auth/register").send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      document: user.document,
      phone: user.phone,
      password: userPassword,
      confirmPassword: userPassword,
    });
    res = await request(app).post("/v1/auth/register").send({
      email: user.email,
      name: user.name,
      surname: user.surname,
      document: user.document,
      phone: user.phone,
      password: userPassword,
      confirmPassword: userPassword,
    });
    expect(res.status).to.equal(400);
    expect(res.body.errorType).to.equal("General");
    expect(res.body.errorMessage).to.equal("El usuario ya existe");
    expect(res.body.errors).to.eql([`El Email '${user.email}' ya existe`]);
    expect(res.body.errorRaw).to.an("null");
    expect(res.body.errorsValidation).to.an("null");
    await userRepository.delete({ email: user.email });
  });
});
