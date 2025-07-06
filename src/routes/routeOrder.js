import express from "express";
import {
  handleListOrders,
  handleGetOrder,
  handleCreateOrder,
  handleEditOrder,
  handleDeleteOrder,
} from "../controllers/orderController.js";

let routerOrder = express.Router();
import { authenticate } from "../middleware/JWT/IsAuth.js";

// Order controller
routerOrder.get("/list-orders", handleListOrders);
routerOrder.get("/get-order", handleGetOrder); // Query string: /api/get-order?orderId=value
routerOrder.post("/create-order", handleCreateOrder);
routerOrder.put("/edit-order", handleEditOrder); // Query string: /api/edit-order?orderId=value
routerOrder.delete("/delete-order", handleDeleteOrder); // Query string: /api/delete-order?orderId=value

export default routerOrder;
