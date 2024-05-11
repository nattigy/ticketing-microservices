import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/orders for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.statusCode).not.toEqual(404);
});

it("can only be accessed if the user is authenticated", async () => {
  await request(app).post("/api/orders").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({});
  expect(response.statusCode).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if invalid price is provided", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: -10,
    })
    .expect(400);
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      title: "title",
    })
    .expect(400);
});

it("creates a order with valid inputs", async () => {
  let orders = await Order.find({});
  expect(orders.length).toEqual(0);

  const title = "title";

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      title,
      price: 10,
    })
    .expect(201);

  orders = await Order.find({})
  expect(orders.length).toEqual(1)
  expect(orders[0].title).toEqual(title)
});

it("publishes an event", async () => {
  const title = "title";

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      title,
      price: 10,
    })
    .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})