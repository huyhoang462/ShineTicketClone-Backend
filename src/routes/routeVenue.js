import express from "express";
import {
  handleListVenues,
  handleGetVenue,
  handleCreateVenue,
  handleEditVenue,
  handleDeleteVenue,
} from "../controllers/venueController.js";
import { authenticate } from "../middleware/JWT/IsAuth.js";

let routerVenue = express.Router();

// Venue controller
routerVenue.get("/list-venues", authenticate, handleListVenues);
routerVenue.get("/get-venue", handleGetVenue); // Query string: /get-venue?venueId=value
routerVenue.post("/create-venue", handleCreateVenue);
routerVenue.put("/edit-venue", handleEditVenue); // Query string: /edit-venue?venueId=value
routerVenue.delete("/delete-venue", handleDeleteVenue); // Query string: /api/delete-venue?venueId=value

export default routerVenue;
