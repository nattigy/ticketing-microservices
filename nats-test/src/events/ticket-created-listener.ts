import {
  KafkaListener,
  NATSListener,
  Subjects,
  TicketCreatedEvent,
} from "@nattigy-com/common";
import { Message } from "node-nats-streaming";

export class TicketCreatedNATSListener extends NATSListener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("event data: ", data);
    msg.ack();
  }
}

export class TicketCreatedKafkaListener extends KafkaListener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("event data: ", data);
    msg.ack();
  }
}
