import {
  listPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from "../services/paymentService.js"; // Nhập các hàm từ paymentService

const handleGetPayment = async (req, res) => {
  const paymentId = req.query.id; // Lấy id thanh toán từ query string
  let result;
  result = await getPaymentById(paymentId); // Lấy thanh toán theo id

  // Trả về kết quả dựa trên kết quả từ service
  return res.status(result.errCode === 0 ? 200 : 400).json(result);
};

const handleListPayments = async (req, res) => {
  const result = await listPayments(); // Lấy danh sách các thanh toán
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleCreatePayment = async (req, res) => {
  const paymentData = req.body; // Dữ liệu thanh toán từ request body
  const result = await createPayment(paymentData); // Gọi service để tạo thanh toán

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleEditPayment = async (req, res) => {
  const paymentId = req.query.id; // Lấy id thanh toán từ query string
  const paymentData = req.body; // Dữ liệu chỉnh sửa từ request body
  const result = await updatePayment(paymentId, paymentData); // Gọi service để cập nhật thanh toán

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleDeletePayment = async (req, res) => {
  const paymentId = req.query.id; // Lấy id thanh toán từ query string
  const result = await deletePayment(paymentId); // Gọi service để xóa thanh toán
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

export {
  handleGetPayment,
  handleCreatePayment,
  handleDeletePayment,
  handleEditPayment,
  handleListPayments,
};
