import {
  listTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketPriceByEvent,
} from "../services/ticketService.js"; // Nhập các hàm từ ticketService

const handleGetTicket = async (req, res) => {
  const ticketId = req.query.id; // Lấy id ticket từ query string
  let result;
  result = await getTicketById(ticketId); // Lấy thông tin ticket theo id

  // Trả về kết quả dựa trên kết quả từ service
  return res.status(result.errCode === 0 ? 200 : 400).json(result);
};
const handleGetTicketPrice = async (req, res) => {
  const EventId = req.body.EventId; // Lấy id ticket từ query string
  let result;
  result = await getTicketPriceByEvent(EventId); // Lấy thông tin ticket theo id

  // Trả về kết quả dựa trên kết quả từ service
  return res.status(result.errCode === 0 ? 200 : 400).json(result);
};

const handleListTickets = async (req, res) => {
  const result = await listTickets(); // Lấy danh sách các ticket
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleCreateTicket = async (req, res) => {
  const ticketData = req.body; // Dữ liệu ticket từ request body
  const result = await createTicket(ticketData); // Gọi service để tạo ticket

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleEditTicket = async (req, res) => {
  const ticketId = req.query.id; // Lấy id ticket từ query string
  const ticketData = req.body; // Dữ liệu chỉnh sửa từ request body
  const result = await updateTicket(ticketId, ticketData); // Gọi service để cập nhật ticket

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleDeleteTicket = async (req, res) => {
  const ticketId = req.query.id; // Lấy id ticket từ query string
  const result = await deleteTicket(ticketId); // Gọi service để xóa ticket
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

export {
  handleGetTicket,
  handleCreateTicket,
  handleDeleteTicket,
  handleEditTicket,
  handleListTickets,
  handleGetTicketPrice,
};
