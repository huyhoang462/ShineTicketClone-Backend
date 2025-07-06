import express from "express";
import { getHomePage } from "../controllers/homeController.js";
import {
  handleCreateUser,
  handleDeleteUser,
  handleEditUser,
  handleForgotPassword,
  handleGetUser,
  handleListUser,
  handleLogin,
  handleLoginAdmin,
  handleLogout,
  handleRegister,
  handleResetPassword,
  handleVerify,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/JWT/IsAuth.js";

let routerUser = express.Router();
// User controller
routerUser.get("/", getHomePage);
routerUser.post("/register", handleRegister);
routerUser.post("/login", handleLogin);
routerUser.post("/login_admin", handleLoginAdmin);
routerUser.get("/logout", handleLogout);
routerUser.post("/reset", handleResetPassword);
routerUser.post("/forgot", handleForgotPassword);
//routerUser.post("/verify", handleVerify);

routerUser.get("/list", handleListUser);
routerUser.get("/get/:id", handleGetUser);
routerUser.post("/create", handleCreateUser);
routerUser.put("/edit", handleEditUser);
routerUser.delete("/delete", handleDeleteUser);

export default routerUser;
