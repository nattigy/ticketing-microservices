import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  validateRequest,
  BadRequestError,
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@nattigy-com/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedNATSPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required!"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero!"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;

    ticket.set({ title, price });
    await ticket.save();

    const publisher = new TicketUpdatedNATSPublisher(natsWrapper.client);

    try {
      publisher.publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });
    } catch (e) {
      console.error("nats publishing error");
      console.error(e);
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
