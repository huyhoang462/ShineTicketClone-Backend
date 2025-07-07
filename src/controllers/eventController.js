import {
  addBannerEvent,
  addSpecialEvent,
  addTrendEvent,
  createEvent,
  deleteBannerEvent,
  deleteEvent,
  deleteSpecialEvent,
  deleteTrendEvent,
  getEventById,
  listBannerEvent,
  listEvents,
  listEventsByUser,
  listSpecialEvent,
  listTrendEvent,
  updateEvent,
  updateEventPaidStatus,
} from "../services/eventService.js";

const handleGetEvent = async (req, res) => {
  let id = req.query.id;
  let result;
  result = await getEventById(id); // Lấy sự kiện theo id
  // Trả về kết quả dựa trên kết quả từ service
  return res.status(result.errCode === 0 ? 200 : 400).json(result);
};

const handleListEvents = async (req, res) => {
  const result = await listEvents(req.query); // Lấy danh sách sự kiện với tham số lọc
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};
const handleListEventsByUser = async (req, res) => {
  const userId = req.query.userId;

  const result = await listEventsByUser(userId); // Lấy danh sách sự kiện
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleCreateEvent = async (req, res) => {
  let uploadedFiles = [];
  try {
    const eventData = req.body;
    const files = req.files;

    // SỬA LỖI: Đổi từ `const` thành `let` để có thể gán lại giá trị
    let logoUrlPath = null;
    let coverImageUrlPath = null;

    // Log để kiểm tra, files từ multer là một object
    console.log("Received files:", files);

    if (files) {
      // Multer trả về một mảng cho mỗi field, chúng ta cần lấy phần tử đầu tiên
      if (files.logo_url && files.logo_url.length > 0) {
        logoUrlPath = files.logo_url[0].filename; // Gán giá trị vào biến let
        uploadedFiles.push(files.logo_url[0].path);
      }

      if (files.cover_image_url && files.cover_image_url.length > 0) {
        coverImageUrlPath = files.cover_image_url[0].filename; // Gán giá trị vào biến let
        uploadedFiles.push(files.cover_image_url[0].path);
      }
    }

    // Thêm thông tin file vào dữ liệu sự kiện
    const newEvent = {
      ...eventData,
      logo_url: logoUrlPath, // Giá trị đã được cập nhật
      cover_image_url: coverImageUrlPath, // Giá trị đã được cập nhật
    };

    console.log("Data to create event:", newEvent);

    // Gọi service để tạo sự kiện
    const result = await createEvent(newEvent);

    // Trả về kết quả
    return res.status(result.errCode === 0 ? 200 : 400).json(result);
  } catch (error) {
    // Xóa file đã upload nếu có lỗi xảy ra
    console.error("Error in handleCreateEvent, rolling back uploads:", error);
    uploadedFiles.forEach((filePath) => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Successfully deleted ${filePath}`);
        }
      } catch (unlinkErr) {
        console.error(`Error deleting file ${filePath}:`, unlinkErr);
      }
    });

    // Trả về lỗi chi tiết hơn cho frontend (trong môi trường dev)
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi server khi tạo sự kiện",
      error: error.message,
    });
  }
};
const handleEditEvent = async (req, res) => {
  const eventId = req.body.id; // Lấy id sự kiện từ URL params

  const eventData = req.body;

  // Lấy thông tin file upload
  if (req.files) {
    if (req.files.logo_url) {
      eventData.logo_url = req.files.logo_url[0].filename; // Lấy tên file
    }
    if (req.files.cover_image_url) {
      eventData.cover_image_url = req.files.cover_image_url[0].filename; // Lấy tên file
    }
  }
  const result = await updateEvent(eventId, eventData); // Gọi service để cập nhật sự kiện

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleUpdatePaid = async (req, res) => {
  // 1. Lấy dữ liệu từ request body một cách rõ ràng
  const { eventId, paidStatus } = req.body;

  // 2. Kiểm tra xem dữ liệu cần thiết có được gửi lên không
  if (!eventId || paidStatus === undefined) {
    return res.status(400).json({
      errCode: 1,
      message:
        "Missing required parameters: eventId and paidStatus are required.",
    });
  }

  try {
    // 3. Gọi hàm service với dữ liệu đã lấy
    const result = await updateEventPaidStatus(eventId, String(paidStatus)); // Chuyển đổi sang String để đảm bảo

    // 4. Trả về response dựa trên kết quả từ service
    // Nếu service trả về errCode khác 0, coi đó là lỗi từ phía client hoặc logic
    if (result.errCode !== 0) {
      // Các lỗi như "Event not found" hoặc "Invalid paid status" sẽ rơi vào đây
      return res.status(400).json(result);
    }

    // Nếu thành công (errCode === 0)
    return res.status(200).json(result);
  } catch (error) {
    // 5. Bắt các lỗi không mong muốn (lỗi server, lỗi database...)
    console.error("Critical error in handleUpdatePaid controller:", error);
    return res.status(500).json({
      errCode: -1,
      message: "Internal Server Error",
    });
  }
};

const handleDeleteEvent = async (req, res) => {
  const eventId = req.body.id; // Lấy id sự kiện từ URL params
  const result = await deleteEvent(eventId); // Gọi service để xóa sự kiện
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

// special
const handleListSpecialEvent = async (req, res) => {
  const result = await listSpecialEvent(); // Gọi service để xóa sự kiện
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};
const handleAddSpecialEvent = async (req, res) => {
  const EventId = req.body.EventId;
  const result = await addSpecialEvent(EventId); // Gọi service để xóa sự kiện
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};
const handleDeleteSpecialEvent = async (req, res) => {
  const EventId = req.body.EventId;
  const result = await deleteSpecialEvent(EventId); // Gọi service để xóa sự kiện
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

// trend
const handleListTrendEvent = async (req, res) => {
  const result = await listTrendEvent(); // Gọi service để xóa sự kiện
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};
const handleAddTrendEvent = async (req, res) => {
  const EventId = req.body.EventId;
  const result = await addTrendEvent(EventId); // Gọi service để xóa sự kiện
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};
const handleDeleteTrendEvent = async (req, res) => {
  const EventId = req.body.EventId;
  const result = await deleteTrendEvent(EventId); // Gọi service để xóa sự kiện
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

// banner
const handleListBannerEvent = async (req, res) => {
  const result = await listBannerEvent(); // Gọi service để xóa sự kiện
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};
const handleAddBannerEvent = async (req, res) => {
  const EventId = req.body.EventId;
  const result = await addBannerEvent(EventId); // Gọi service để xóa sự kiện
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};
const handleDeleteBannerEvent = async (req, res) => {
  const EventId = req.body.EventId;
  const result = await deleteBannerEvent(EventId); // Gọi service để xóa sự kiện
  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

export {
  handleGetEvent,
  handleCreateEvent,
  handleDeleteEvent,
  handleEditEvent,
  handleListEvents,
  handleListEventsByUser,
  handleAddBannerEvent,
  handleAddSpecialEvent,
  handleAddTrendEvent,
  handleDeleteBannerEvent,
  handleDeleteSpecialEvent,
  handleDeleteTrendEvent,
  handleListBannerEvent,
  handleListSpecialEvent,
  handleListTrendEvent,
  handleUpdatePaid,
};
