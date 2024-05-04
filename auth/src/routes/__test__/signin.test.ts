import request from "supertest";
import { app } from "../../app";

it("failes when an email that doesn't exist is supplied", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("returs a 400 with an invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "testtest.com",
      password: "password",
    })
    .expect(400);
});

it("returs a 400 with an invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "pas",
    })
    .expect(400);
});

it("returs a 400 with an incorrect password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "passwordd",
    })
    .expect(400);
});

it("returs a 400 with an empty email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com" })
    .expect(400);
  await request(app).post("/api/users/signin").send({ email: "" }).expect(400);
  await request(app)
    .post("/api/users/signin")
    .send({ password: "" })
    .expect(400);
  await request(app)
    .post("/api/users/signin")
    .send({ password: "password" })
    .expect(400);
  return request(app).post("/api/users/signin").send({}).expect(400);
});

it("sets a cookie after a successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
