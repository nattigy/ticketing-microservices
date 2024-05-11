import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("has a route handler listening to /api/orders for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.statusCode).not.toEqual(404);
});

it("returns a 404 if the order is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/orders/${id}`).send().expect(404);
});

it("returns the order if it is found", async () => {
  const title = "title";
  const price = 10;
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const orderResponse = await request(app)
    .get(`/api/orders/${response.body.id}`)
    .send()
    .expect(200);

  expect(orderResponse.body.title).toEqual(title);
  expect(orderResponse.body.price).toEqual(price);
});
