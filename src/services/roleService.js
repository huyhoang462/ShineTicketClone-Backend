import Roles from "../models/role.js";

export const listRoles = async () => {
  try {
    const roles = await Roles.findAll();
    return {
      errCode: 0,
      message: "Roles fetched successfully.",
      data: roles,
    };
  } catch (error) {
    console.error("Error fetching roles:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch roles.",
    };
  }
};

export const getRoleById = async (roleId) => {
  try {
    const role = await Roles.findByPk(roleId);
    if (!role) {
      return {
        errCode: 2,
        message: "Role not found with the given ID.",
      };
    }
    return {
      errCode: 0,
      message: "Role fetched successfully.",
      data: role,
    };
  } catch (error) {
    console.error("Error fetching role by ID:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch role.",
    };
  }
};

export const createRole = async (roleData) => {
  try {
    const newRole = await Roles.create(roleData);
    return {
      errCode: 0,
      message: "Role created successfully.",
      data: newRole,
    };
  } catch (error) {
    console.error("Error creating role:", error.message);
    return {
      errCode: 1,
      message: "Unable to create role.",
    };
  }
};

export const updateRole = async (roleId, roleData) => {
  try {
    const [updatedRowsCount] = await Roles.update(roleData, {
      where: { role_id: roleId },
    });
    if (updatedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Role not found with the given ID for updating.",
      };
    }
    return {
      errCode: 0,
      message: "Role updated successfully.",
    };
  } catch (error) {
    console.error("Error updating role:", error.message);
    return {
      errCode: 1,
      message: "Unable to update role.",
    };
  }
};

export const deleteRole = async (roleId) => {
  try {
    const deletedRowsCount = await Roles.destroy({
      where: { role_id: roleId },
    });
    if (deletedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Role not found with the given ID for deletion.",
      };
    }
    return {
      errCode: 0,
      message: "Role deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting role:", error.message);
    return {
      errCode: 1,
      message: "Unable to delete role.",
    };
  }
};
