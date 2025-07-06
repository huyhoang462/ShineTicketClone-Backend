import express from "express";
import {
  handleListRoles,
  handleGetRole,
  handleCreateRole,
  handleEditRole,
  handleDeleteRole,
} from "../controllers/roleController.js";

let routerRole = express.Router();

// Role controller
routerRole.get("/list-roles", handleListRoles);
routerRole.get("/get-role", handleGetRole);
routerRole.post("/create-role", handleCreateRole);
routerRole.put("/edit-role", handleEditRole);
routerRole.delete("/delete-role", handleDeleteRole);

export default routerRole;
