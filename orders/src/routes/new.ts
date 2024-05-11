import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  validateRequest,
  BadRequestError,
  requireAuth,
} from "@nattigy-com/common";
import { Order } from "../models/order";
import { OrderCreatedNATSPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TickerId is required!"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero!"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId, price } = req.body;

    const order = Order.build({
      ticketId,
      price,
      userId: req.currentUser!.id,
    });
    await order.save();

    const publisher = new OrderCreatedNATSPublisher(natsWrapper.client);

    try {
      await publisher.publish({
        id: order.id,
        ticketId: order.ticketId,
        price: order.price,
        userId: order.userId,
      });
    } catch (e) {
      console.error("nats publishing error");
      console.error(e);
    }

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
