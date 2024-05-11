import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .put(`/api/orders/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: 10,
    })
    .expect(404);
});

it("returns a 401 if the user does not own the order", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/orders/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "updated title",
      price: 10,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: -10,
    })
    .expect(400);
});

it("updates the order provided all inputs are correct", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: 10,
    })
    .expect(201);

  const newTitle = "new title";
  await request(app)
    .put(`/api/orders/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: 10,
    })
    .expect(200);

  const orderResponse = await request(app)
    .get(`/api/orders/${response.body.id}`)
    .send()
    .expect(200);

  expect(orderResponse.body.title).toEqual(newTitle);
});

it("publishes an event", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: 10,
    })
    .expect(201);

  const newTitle = "new title";
  await request(app)
    .put(`/api/orders/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: 10,
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
