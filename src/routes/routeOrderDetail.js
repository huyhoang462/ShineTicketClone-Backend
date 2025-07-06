import express from "express";
import {
  handleGetOrderDetail,
  handleCreateOrderDetail,
  handleEditOrderDetail,
  handleDeleteOrderDetail,
  handleListOrderDetailsByUser,
} from "../controllers/orderDetailController.js";

let routerOrderDetail = express.Router();

// OrderDetail controller
routerOrderDetail.get("/list-order-details", handleListOrderDetailsByUser);
routerOrderDetail.get("/get-order-detail", handleGetOrderDetail); // Query string: /api/get-order-detail?orderDetailId=value
routerOrderDetail.post("/create-order-detail", handleCreateOrderDetail);
routerOrderDetail.put("/edit-order-detail", handleEditOrderDetail); // Query string: /api/edit-order-detail?orderDetailId=value
routerOrderDetail.delete("/delete-order-detail", handleDeleteOrderDetail); // Query string: /api/delete-order-detail?orderDetailId=value

export default routerOrderDetail;
