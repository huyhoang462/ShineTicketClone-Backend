import express from "express";

import routerEvent from "./routeEvent.js";
import routerOrder from "./routeOrder.js";
import routerOrderDetail from "./routeOrderDetail.js";
import routerOrganizer from "./routeOrganizer.js";
import routerPayment from "./routePayment.js";
import routerRole from "./routeRole.js";
import routerTicket from "./routeTicket.js";
import routerUser from "./routeUser.js";
import routerVenue from "./routeVenue.js";
import { refreshToken } from "../middleware/JWT/Token.js";

import PaymentStatus from "../models/payment_status.js";
import routerRefund from "./routeRefund.js";

let router = express.Router();

let initWebRoutes = (app) => {
  // Import routes
  app.use("/api/user", routerUser);
  app.use("/api/order-detail", routerOrderDetail);
  app.use("/api/ticket", routerTicket);
  app.use("/api/venue", routerVenue);
  app.use("/api/order", routerOrder);
  app.use("/api/payment", routerPayment);
  app.use("/api/event", routerEvent);
  app.use("/api/role", routerRole);
  app.use("/api/organizer", routerOrganizer);
  app.use("/api/refund", routerRefund);

  app.use("/refresh_token", refreshToken);
  app.use("/fetch/add", addeventstatus);
};

const addeventstatus = async (req, res) => {
  const { status_name } = req.body;

  if (!status_name) {
    return res.status(400).json({
      message: "  status_name is required.",
    });
  }

  try {
    const newStatus = await PaymentStatus.create({ status_name });
    res.status(201).json(newStatus);
  } catch (error) {
    console.error("Error creating EventStatus:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
export default initWebRoutes;
