import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
  listOrdersByEvent,
} from "../services/orderService.js"; // Nhập các hàm từ orderService

const handleGetOrder = async (req, res) => {
  const orderId = req.query.id; // Lấy id đơn hàng từ query string
  let result;
  result = await getOrderById(orderId); // Lấy đơn hàng theo id

  // Trả về kết quả dựa trên kết quả từ service
  return res.status(result.errCode === 0 ? 200 : 400).json(result);
};

const handleListOrders = async (req, res) => {
  const eventId = req.body.eventId;
  const result = await listOrdersByEvent(eventId); // Lấy danh sách đơn hàng
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleCreateOrder = async (req, res) => {
  const orderData = req.body; // Dữ liệu đơn hàng từ request body
  const result = await createOrder(orderData); // Gọi service để tạo đơn hàng

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleEditOrder = async (req, res) => {
  const orderId = req.query.id; // Lấy id đơn hàng từ query string
  const orderData = req.body; // Dữ liệu chỉnh sửa từ request body
  const result = await updateOrder(orderId, orderData); // Gọi service để cập nhật đơn hàng

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleDeleteOrder = async (req, res) => {
  const orderId = req.query.id; // Lấy id đơn hàng từ query string
  const result = await deleteOrder(orderId); // Gọi service để xóa đơn hàng
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

export {
  handleGetOrder,
  handleCreateOrder,
  handleDeleteOrder,
  handleEditOrder,
  handleListOrders,
};
