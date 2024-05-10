import nats from "node-nats-streaming";
import { TicketCreatedNATSPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const data = {
    id: "453532",
    title: "title",
    userId: "sadfasdf",
    price: 20,
  };

  const publisher = new TicketCreatedNATSPublisher(stan);

  try {
    await publisher.publish(data);
  } catch (e) {
    console.error(e);
  }
});
