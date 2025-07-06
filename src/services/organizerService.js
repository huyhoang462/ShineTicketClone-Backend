import Organizers from "../models/organizer.js";

export const listOrganizers = async () => {
  try {
    const organizers = await Organizers.findAll();
    return {
      errCode: 0,
      message: "Organizers fetched successfully.",
      data: organizers,
    };
  } catch (error) {
    console.error("Error fetching organizers:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch organizers.",
    };
  }
};

export const getOrganizerById = async (organizerId) => {
  try {
    const organizer = await Organizers.findByPk(organizerId);
    if (!organizer) {
      return {
        errCode: 2,
        message: "Organizer not found with the given ID.",
      };
    }
    return {
      errCode: 0,
      message: "Organizer fetched successfully.",
      data: organizer,
    };
  } catch (error) {
    console.error("Error fetching organizer by ID:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch organizer.",
    };
  }
};

export const createOrganizer = async (organizerData) => {
  try {
    const newOrganizer = await Organizers.create(organizerData);
    return {
      errCode: 0,
      message: "Organizer created successfully.",
      data: newOrganizer,
    };
  } catch (error) {
    console.error("Error creating organizer:", error.message);
    return {
      errCode: 1,
      message: "Unable to create organizer.",
    };
  }
};

export const updateOrganizer = async (organizerId, organizerData) => {
  try {
    const [updatedRowsCount] = await Organizers.update(organizerData, {
      where: { organizer_id: organizerId }, // Use the correct column name here
    });
    if (updatedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Organizer not found with the given ID for updating.",
      };
    }
    return {
      errCode: 0,
      message: `Organizer with ID ${organizerId} updated successfully.`,
    };
  } catch (error) {
    console.error("Error updating organizer:", error.message);
    return {
      errCode: 1,
      message: "Unable to update organizer.",
    };
  }
};

export const deleteOrganizer = async (organizerId) => {
  try {
    const deletedRowsCount = await Organizers.destroy({
      where: { organizer_id: organizerId }, // Use the correct column name here
    });
    if (deletedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Organizer not found with the given ID for deletion.",
      };
    }
    return {
      errCode: 0,
      message: `Organizer with ID ${organizerId} deleted successfully.`,
    };
  } catch (error) {
    console.error("Error deleting organizer:", error.message);
    return {
      errCode: 1,
      message: "Unable to delete organizer.",
    };
  }
};
