import express from "express";
import {
  handleCreateRefund,
  handleDeleteRefund,
  handleEditRefund,
  handleListRefund,
} from "../controllers/refundController.js";
let routerRefund = express.Router();
//
routerRefund.get("/list_refund", handleListRefund);
routerRefund.put("/update_refund", handleEditRefund);
routerRefund.delete("/delete_refund", handleDeleteRefund);
routerRefund.post("/create_refund", handleCreateRefund);
export default routerRefund;
