import {
  createRefund,
  deleteRefund,
  listRefund,
  updateRefund,
} from "../services/refundService.js";

export const handleListRefund = async (req, res) => {
  const result = await listRefund(); // Lấy danh sách các ticket
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

export const handleEditRefund = async (req, res) => {
  const eventId = req.query.id; // Lấy id ticket từ query string
  const data = req.body.status_id; // Dữ liệu chỉnh sửa từ request body
  const result = await updateRefund(eventId, data); // Gọi service để cập nhật ticket

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};
export const handleDeleteRefund = async (req, res) => {
  const eventId = req.query.id; // Lấy id ticket từ query string
  const result = await deleteRefund(eventId); // Gọi service để xóa ticket
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};
export const handleCreateRefund = async (req, res) => {
  const Data = req.body; // Dữ liệu ticket từ request body
  const result = await createRefund(Data); // Gọi service để tạo ticket

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};
