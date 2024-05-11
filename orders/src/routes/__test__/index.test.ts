import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
    return   request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: 10,
    })
}

it("can fetch a list of orders", async () => {
    await createTicket()
    await createTicket()
    await createTicket()

    const response = await request(app).get("/api/orders").send().expect(200)

    expect(response.body.length).toEqual(3)
})
