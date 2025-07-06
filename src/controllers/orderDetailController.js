import {
  listOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
} from "../services/orderDetailService.js"; // Nhập các hàm từ orderDetailService

const handleGetOrderDetail = async (req, res) => {
  const orderDetailId = req.query.id; // Lấy id chi tiết đơn hàng từ query string
  let result;
  result = await getOrderDetailById(orderDetailId); // Lấy chi tiết đơn hàng theo id

  // Trả về kết quả dựa trên kết quả từ service
  return res.status(result.errCode === 0 ? 200 : 400).json(result);
};

const handleListOrderDetailsByUser = async (req, res) => {
  const UserId = req.query.UserId; // Lấy id đơn hàng từ query string
  const result = await listOrderDetails(UserId); // Lấy danh sách chi tiết đơn hàng theo orderId
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleCreateOrderDetail = async (req, res) => {
  const orderDetailData = req.body; // Dữ liệu chi tiết đơn hàng từ request body
  const result = await createOrderDetail(orderDetailData); // Gọi service để tạo chi tiết đơn hàng

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleEditOrderDetail = async (req, res) => {
  const orderDetailId = req.query.id; // Lấy id chi tiết đơn hàng từ query string
  const orderDetailData = req.body; // Dữ liệu chỉnh sửa từ request body
  const result = await updateOrderDetail(orderDetailId, orderDetailData); // Gọi service để cập nhật chi tiết đơn hàng

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleDeleteOrderDetail = async (req, res) => {
  const orderDetailId = req.query.id; // Lấy id chi tiết đơn hàng từ query string
  const result = await deleteOrderDetail(orderDetailId); // Gọi service để xóa chi tiết đơn hàng
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

export {
  handleGetOrderDetail,
  handleCreateOrderDetail,
  handleDeleteOrderDetail,
  handleEditOrderDetail,
  handleListOrderDetailsByUser,
};
