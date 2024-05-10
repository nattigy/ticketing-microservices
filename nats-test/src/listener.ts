import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedNATSListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS Connectoin closed");
    process.exit();
  });

  new TicketCreatedNATSListener(stan).listen()
});

process.on("SIGINT", () => stan.close());
process.on("SIGTER", () => stan.close());



