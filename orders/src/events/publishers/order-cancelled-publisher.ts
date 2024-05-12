import {
  KafkaPublisher,
  NATSPublisher,
  Subjects,
  OrderCancelledEvent,
} from "@nattigy-com/common";

export class OrderCancelledNATSPublisher extends NATSPublisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

export class OrderCancelledKafkaPublisher extends KafkaPublisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
