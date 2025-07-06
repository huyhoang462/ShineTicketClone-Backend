import Venues from "../models/venue.js";

export const listVenues = async () => {
  try {
    const venues = await Venues.findAll();
    return {
      errCode: 0,
      message: "Venues fetched successfully.",
      data: venues,
    };
  } catch (error) {
    console.error("Error fetching venues:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch venues.",
    };
  }
};

export const getVenueById = async (venueId) => {
  try {
    const venue = await Venues.findByPk(venueId);
    if (!venue) {
      return {
        errCode: 2,
        message: "Venue not found with the given ID.",
      };
    }
    return {
      errCode: 0,
      message: "Venue fetched successfully.",
      data: venue,
    };
  } catch (error) {
    console.error("Error fetching venue by ID:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch venue.",
    };
  }
};

export const createVenue = async (venueData) => {
  try {
    const newVenue = await Venues.create(venueData);
    return {
      errCode: 0,
      message: "Venue created successfully.",
      data: newVenue,
    };
  } catch (error) {
    console.error("Error creating venue:", error.message);
    return {
      errCode: 1,
      message: "Unable to create venue.",
    };
  }
};

export const updateVenue = async (venueId, venueData) => {
  try {
    const [updatedRowsCount] = await Venues.update(venueData, {
      where: { venue_id: venueId },
    });
    if (updatedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Venue not found with the given ID for updating.",
      };
    }
    return {
      errCode: 0,
      message: "Venue updated successfully.",
    };
  } catch (error) {
    console.error("Error updating venue:", error.message);
    return {
      errCode: 1,
      message: "Unable to update venue.",
    };
  }
};

export const deleteVenue = async (venueId) => {
  try {
    const deletedRowsCount = await Venues.destroy({
      where: { venue_id: venueId },
    });
    if (deletedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Venue not found with the given ID for deletion.",
      };
    }
    return {
      errCode: 0,
      message: "Venue deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting venue:", error.message);
    return {
      errCode: 1,
      message: "Unable to delete venue.",
    };
  }
};
