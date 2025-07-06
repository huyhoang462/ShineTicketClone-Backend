import {
  listRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../services/roleService.js"; // Nhập các hàm từ roleService

const handleGetRole = async (req, res) => {
  const roleId = req.query.id; // Lấy id role từ query string
  let result;
  result = await getRoleById(roleId); // Lấy thông tin role theo id

  // Trả về kết quả dựa trên kết quả từ service
  return res.status(result.errCode === 0 ? 200 : 400).json(result);
};

const handleListRoles = async (req, res) => {
  const result = await listRoles(); // Lấy danh sách các role
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleCreateRole = async (req, res) => {
  const roleData = req.body; // Dữ liệu role từ request body
  const result = await createRole(roleData); // Gọi service để tạo role

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleEditRole = async (req, res) => {
  const roleId = req.query.id; // Lấy id role từ query string
  const roleData = req.body; // Dữ liệu chỉnh sửa từ request body
  const result = await updateRole(roleId, roleData); // Gọi service để cập nhật role

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleDeleteRole = async (req, res) => {
  const roleId = req.query.id; // Lấy id role từ query string
  const result = await deleteRole(roleId); // Gọi service để xóa role
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

export {
  handleGetRole,
  handleCreateRole,
  handleDeleteRole,
  handleEditRole,
  handleListRoles,
};
