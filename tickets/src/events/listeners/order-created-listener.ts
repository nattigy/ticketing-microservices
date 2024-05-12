import {
  KafkaListener,
  NATSListener,
  Subjects,
  OrderCreatedEvent,
  NotFoundError,
} from "@nattigy-com/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedNATSPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedNATSListener extends NATSListener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ orderId: data.id });

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

export class OrderCreatedKafkaListener extends KafkaListener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  onMessage(data: OrderCreatedEvent["data"], msg: Message): void {}
}
