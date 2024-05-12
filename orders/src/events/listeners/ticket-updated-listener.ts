import {
  KafkaListener,
  NATSListener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@nattigy-com/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedNATSListener extends NATSListener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    const { title, price } = data;
    
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}

export class TicketUpdatedKafkaListener extends KafkaListener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  onMessage(data: TicketUpdatedEvent["data"], msg: Message): void {}
}
