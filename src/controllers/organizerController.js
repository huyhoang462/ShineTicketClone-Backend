import {
  listOrganizers,
  getOrganizerById,
  createOrganizer,
  updateOrganizer,
  deleteOrganizer,
} from "../services/organizerService.js"; // Nhập các hàm từ organizerService

const handleGetOrganizer = async (req, res) => {
  const organizerId = req.query.id; // Lấy id người tổ chức từ query string
  let result;
  result = await getOrganizerById(organizerId); // Lấy người tổ chức theo id

  // Trả về kết quả dựa trên kết quả từ service
  return res.status(result.errCode === 0 ? 200 : 400).json(result);
};

const handleListOrganizers = async (req, res) => {
  const result = await listOrganizers(); // Lấy danh sách người tổ chức
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleCreateOrganizer = async (req, res) => {
  const organizerData = req.body; // Dữ liệu người tổ chức từ request body
  const result = await createOrganizer(organizerData); // Gọi service để tạo người tổ chức

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleEditOrganizer = async (req, res) => {
  const organizerId = req.query.id; // Lấy id người tổ chức từ query string
  const organizerData = req.body; // Dữ liệu chỉnh sửa từ request body
  const result = await updateOrganizer(organizerId, organizerData); // Gọi service để cập nhật người tổ chức

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleDeleteOrganizer = async (req, res) => {
  const organizerId = req.query.id; // Lấy id người tổ chức từ query string
  const result = await deleteOrganizer(organizerId); // Gọi service để xóa người tổ chức
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

export {
  handleGetOrganizer,
  handleCreateOrganizer,
  handleDeleteOrganizer,
  handleEditOrganizer,
  handleListOrganizers,
};
