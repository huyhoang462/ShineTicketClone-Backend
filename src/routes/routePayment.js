import express from "express";
import {
  handleListPayments,
  handleGetPayment,
  handleCreatePayment,
  handleEditPayment,
  handleDeletePayment,
} from "../controllers/paymentController.js";

let routerPayment = express.Router();

// Payment controller
routerPayment.get("/list-payments", handleListPayments);
routerPayment.get("/get-payment", handleGetPayment); // Query string: /get-payment?paymentId=value
routerPayment.post("/create-payment", handleCreatePayment);
routerPayment.put("/edit-payment", handleEditPayment); // Query string: /edit-payment?paymentId=value
routerPayment.delete("/delete-payment", handleDeletePayment); // Query string: /api/delete-payment?paymentId=value

export default routerPayment;
