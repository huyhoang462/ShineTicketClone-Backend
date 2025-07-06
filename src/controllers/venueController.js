import {
  listVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../services/venueService.js"; // Nhập các hàm từ venueService

const handleGetVenue = async (req, res) => {
  const venueId = req.query.id; // Lấy id venue từ query string
  let result;
  result = await getVenueById(venueId); // Lấy thông tin venue theo id

  // Trả về kết quả dựa trên kết quả từ service
  return res.status(result.errCode === 0 ? 200 : 400).json(result);
};

const handleListVenues = async (req, res) => {
  const result = await listVenues(); // Lấy danh sách các venue
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleCreateVenue = async (req, res) => {
  const venueData = req.body; // Dữ liệu venue từ request body
  const result = await createVenue(venueData); // Gọi service để tạo venue

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleEditVenue = async (req, res) => {
  const venueId = req.query.id; // Lấy id venue từ query string
  const venueData = req.body; // Dữ liệu chỉnh sửa từ request body
  const result = await updateVenue(venueId, venueData); // Gọi service để cập nhật venue

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleDeleteVenue = async (req, res) => {
  const venueId = req.query.id; // Lấy id venue từ query string
  const result = await deleteVenue(venueId); // Gọi service để xóa venue
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

export {
  handleGetVenue,
  handleCreateVenue,
  handleDeleteVenue,
  handleEditVenue,
  handleListVenues,
};
