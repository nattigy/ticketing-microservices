import {
    KafkaPublisher,
    NATSPublisher,
    Subjects,
    TicketUpdatedEvent,
  } from "@nattigy-com/common";
  
  export class TicketUpdatedNATSPublisher extends NATSPublisher<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  }
  
  export class TicketUpdatedKafkaPublisher extends KafkaPublisher<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  }
  