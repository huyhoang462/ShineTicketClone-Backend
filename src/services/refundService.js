import Refund from "../models/refund.js";
import Event from "../models/event.js"; // Import model Event
import Organizer from "../models/organizer.js"; // Import model Organizer
export const createRefund = async (data) => {
  try {
    // Tạo mới bản ghi Refund từ dữ liệu đầu vào
    const newRefund = new Refund({
      event_id: data.event_id,
      organizer_id: data.organizer_id,
      total_amount: data.total_amount,
      refund_amount: data.refund_amount,
      commission: data.commission,
      refund_date: data.refund_date,
      payment_status_id: data.payment_status_id || "675ea40ce482c1ed0507f16a",
      notes: data.notes || null, // Nếu không có ghi chú, đặt giá trị mặc định là null
    });

    // Lưu bản ghi vào database
    const savedRefund = await Refund.create(newRefund);

    return {
      errCode: 0,
      message: "Refund created successfully.",
      data: savedRefund,
    };
  } catch (error) {
    console.error("Error creating refund:", error.message);
    return {
      errCode: 1,
      message: "Unable to create refund.",
    };
  }
};

export const listRefund = async () => {
  try {
    // Truy vấn danh sách refund và populate thông tin Event và Organizer
    const refunds = await Refund.find()
      .populate({
        path: "event_id", // Populate thông tin từ Event
      })
      .populate({
        path: "organizer_id", // Populate thông tin từ Organizer
      });

    // Trả về kết quả
    return {
      errCode: 0,
      message: "List Refund successfully.",
      data: refunds,
    };
  } catch (error) {
    console.error("Error fetching refunds:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch refunds.",
    };
  }
};

export const updateRefund = async (eventId, status) => {
  try {
    const [updatedRowsCount] = await Tickets.update(ticketData, {
      where: { ticket_id: ticketId },
    });
    if (updatedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Ticket not found with the given ID for updating.",
      };
    }
    return {
      errCode: 0,
      message: "Ticket updated successfully.",
    };
  } catch (error) {
    console.error("Error updating ticket:", error.message);
    return {
      errCode: 1,
      message: "Unable to update ticket.",
    };
  }
};

export const deleteRefund = async (eventId) => {
  try {
    if (deletedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Ticket not found with the given ID for deletion.",
      };
    }
    return {
      errCode: 0,
      message: "Ticket deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting ticket:", error.message);
    return {
      errCode: 1,
      message: "Unable to delete ticket.",
    };
  }
};
