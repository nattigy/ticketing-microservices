import mongoose from "mongoose";
import { Order, OrderStatus } from "../order";
import { Ticket } from "../ticket";

const ticketId = new mongoose.Types.ObjectId().toHexString()

it("implements optimistic concurrency control", async () => {
  
  const ticket = Ticket.build({
    id: ticketId,
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  const firstInstance = await Order.findById(order.id);
  const secondInstance = await Order.findById(order.id);

  firstInstance?.set({ price: 15 });
  secondInstance?.set({ price: 10 });

  await firstInstance?.save()

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error("Should not reach this point!")
});

it("increaments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    id: ticketId,
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();
  expect(order.version).toEqual(0)
  await order.save();
  expect(order.version).toEqual(1)
  await order.save();
  expect(order.version).toEqual(2)
});
