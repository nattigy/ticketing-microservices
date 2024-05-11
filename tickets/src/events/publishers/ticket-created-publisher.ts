import {
    KafkaPublisher,
    NATSPublisher,
    Subjects,
    TicketCreatedEvent,
  } from "@nattigy-com/common";
  
  export class TicketCreatedNATSPublisher extends NATSPublisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  }
  
  export class TicketCreatedKafkaPublisher extends KafkaPublisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  }
  