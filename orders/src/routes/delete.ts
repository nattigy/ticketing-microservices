import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  validateRequest,
  BadRequestError,
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@nattigy-com/common";
import { Order } from "../models/order";
import { OrderUpdatedNATSPublisher } from "../events/publishers/order-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;

    order.set({ title, price });
    await order.save();

    const publisher = new OrderUpdatedNATSPublisher(natsWrapper.client);

    try {
      publisher.publish({
        id: order.id,
        title: order.title,
        price: order.price,
        userId: order.userId,
      });
    } catch (e) {
      console.error("nats publishing error");
      console.error(e);
    }

    res.send(order);
  }
);

export { router as updateDeleteRouter };
