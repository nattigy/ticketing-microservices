import {
    KafkaPublisher,
    NATSPublisher,
    Subjects,
    OrderCreatedEvent,
  } from "@nattigy-com/common";
  
  export class OrderCreatedNATSPublisher extends NATSPublisher<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  }
  
  export class OrderCreatedKafkaPublisher extends KafkaPublisher<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  }
  