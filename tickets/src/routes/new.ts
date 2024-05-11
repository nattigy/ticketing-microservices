import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  validateRequest,
  BadRequestError,
  requireAuth,
} from "@nattigy-com/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedNATSPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required!"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero!"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();

    const publisher = new TicketCreatedNATSPublisher(natsWrapper.client);

    try {
      await publisher.publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });
    } catch (e) {
      console.error("nats publishing error");
      console.error(e);
    }

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
