import {
  KafkaListener,
  NATSListener,
  Subjects,
  OrderCancelledEvent,
  NotFoundError,
} from "@nattigy-com/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedNATSPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledNATSListener extends NATSListener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ orderId: undefined });

    await ticket.save();
    await new TicketUpdatedNATSPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}

export class OrderCancelledKafkaListener extends KafkaListener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  onMessage(data: OrderCancelledEvent["data"], msg: Message): void {}
}
