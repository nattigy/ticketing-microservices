import {
    KafkaPublisher,
    NATSPublisher,
    Subjects,
    OrderUpdatedEvent,
  } from "@nattigy-com/common";
  
  export class OrderUpdatedNATSPublisher extends NATSPublisher<OrderUpdatedEvent> {
    readonly subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
  }
  
  export class OrderUpdatedKafkaPublisher extends KafkaPublisher<OrderUpdatedEvent> {
    readonly subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
  }
  