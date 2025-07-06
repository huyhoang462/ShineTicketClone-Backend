import express from "express";
import {
  handleListOrganizers,
  handleGetOrganizer,
  handleCreateOrganizer,
  handleEditOrganizer,
  handleDeleteOrganizer,
} from "../controllers/organizerController.js";

let routerOrganizer = express.Router();

// Organizer controller
routerOrganizer.get("/list-organizers", handleListOrganizers);
routerOrganizer.get("/get-organizer", handleGetOrganizer); // Query string: /get-organizer?organizerId=value
routerOrganizer.post("/create-organizer", handleCreateOrganizer);
routerOrganizer.put("/edit-organizer", handleEditOrganizer); // Query string: /edit-organizer?organizerId=value
routerOrganizer.delete("/delete-organizer", handleDeleteOrganizer); // Query string: /api/delete-organizer?organizerId=value

export default routerOrganizer;
