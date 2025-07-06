import express from "express";

import {
  handleAddBannerEvent,
  handleAddSpecialEvent,
  handleAddTrendEvent,
  handleDeleteBannerEvent,
  handleDeleteEvent,
  handleDeleteSpecialEvent,
  handleDeleteTrendEvent,
  handleListBannerEvent,
  handleListEventsByUser,
  handleListSpecialEvent,
  handleListTrendEvent,
} from "../controllers/eventController.js";
import { handleListEvents } from "../controllers/eventController.js";
import { handleGetEvent } from "../controllers/eventController.js";
import { handleCreateEvent } from "../controllers/eventController.js";
import { handleEditEvent } from "../controllers/eventController.js";
import { authenticate } from "../middleware/JWT/IsAuth.js";

import upload from "../middleware/Image/Upload.js";

let routerEvent = express.Router();

// Event controller
routerEvent.get("/list", handleListEvents);
routerEvent.get("/get", handleGetEvent);
routerEvent.get("/get_by_user", handleListEventsByUser);
routerEvent.post(
  "/create",
  upload.fields([
    { name: "logo_url", maxCount: 1 },
    { name: "cover_image_url", maxCount: 1 },
  ]),
  handleCreateEvent
);
routerEvent.put(
  "/edit",
  upload.fields([
    { name: "logo_url", maxCount: 1 },
    { name: "cover_image_url", maxCount: 1 },
  ]),
  handleEditEvent
);
routerEvent.delete("/delete", authenticate, handleDeleteEvent);

// special
routerEvent.get("/list_special", handleListSpecialEvent);
routerEvent.post("/add_special", handleAddSpecialEvent);
routerEvent.delete("/delete_special", handleDeleteSpecialEvent);

// trend
routerEvent.get("/list_trend", handleListTrendEvent);
routerEvent.post("/add_trend", handleAddTrendEvent);
routerEvent.delete("/delete_trend", handleDeleteTrendEvent);

//banner
routerEvent.get("/list_banner", handleListBannerEvent);
routerEvent.post("/add_banner", handleAddBannerEvent);
routerEvent.delete("/delete_banner", handleDeleteBannerEvent);

export default routerEvent;
