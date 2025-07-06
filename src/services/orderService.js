import Order from "../models/order.js";
import OrderDetail from "../models/order_detail.js";
import Ticket from "../models/ticket.js";
export const listOrdersByEvent = async (eventId) => {
  try {
    // Tìm các đơn hàng theo `eventId` (hoặc tất cả nếu không có `eventId`)
    const orders = eventId
      ? await Order.find({ event_id: eventId })
          .populate({
            path: "event_id",
            select: "event_name organizer_id",
            populate: {
              path: "organizer_id",
            },
          })
          .populate({
            path: "user_id", // Thêm thông tin user
          })
      : await Order.find()
          .populate({
            path: "event_id",
            select: "event_name organizer_id",
          })
          .populate({
            path: "user_id", // Thêm thông tin user
          });

    // Kiểm tra nếu không có đơn hàng nào
    if (orders.length === 0) {
      return {
        errCode: 2,
        message: eventId
          ? "No orders found for this event."
          : "No orders found.",
      };
    }

    // Sử dụng `Promise.all` để tối ưu hóa việc lấy `OrderDetail`
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const orderDetails = await OrderDetail.find({ order_id: order._id });

        // Gắn thông tin `order_details` và `organizer` vào đơn hàng
        return {
          ...order.toObject(), // Chuyển `order` thành plain object
          total_amount: order.total_amount.toString(), // Chuyển đổi Decimal128 thành chuỗi
          order_details: orderDetails.map((detail) => ({
            ticket_type: detail.ticket_type,
            ticket_date: detail.ticket_date,
            price: detail.price.toString(), // Chuyển đổi Decimal128 thành chuỗi
          })),
          // organizer: order.event_id.organizer_id || null, // Gắn toàn bộ thông tin organizer
        };
      })
    );

    // Trả về kết quả
    return {
      errCode: 0,
      message: "Success",
      data: ordersWithDetails,
    };
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch orders.",
    };
  }
};

export const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        errCode: 2,
        message: "Order not found.",
      };
    }
    return {
      errCode: 0,
      message: "Success",
      data: order,
    };
  } catch (error) {
    console.error("Error fetching order:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch order.",
    };
  }
};
export const createOrder = async (orderData) => {
  const session = await Order.startSession();
  session.startTransaction();

  let newOrder = null; // Khởi tạo newOrder để tránh lỗi ReferenceError

  try {
    // 1. Tạo đơn đặt
    const { order_details, ...orderFields } = orderData;
    newOrder = await Order.create([orderFields], { session });

    // 2. Lưu chi tiết đơn và xử lý giảm số lượng vé
    for (const detail of order_details) {
      const { ticket_id, ticket_type, ticket_date, price } = detail;

      // Lưu từng chi tiết đơn
      const orderDetail = new OrderDetail({
        order_id: newOrder[0]._id,
        ticket_id,
        ticket_type,
        ticket_date,
        price,
      });

      await orderDetail.save({ session });

      // Giảm số lượng vé
      const ticket = await Ticket.findById(ticket_id).session(session);
      if (!ticket) {
        throw new Error(`Ticket with ID ${ticket_id} not found.`);
      }

      // Check if ticket quantity is enough
      if (ticket.ticket_quantity < 1) {
        throw new Error(
          `Not enough tickets available for Ticket ID ${ticket_id}.`
        );
      }

      // Giảm số lượng vé
      ticket.ticket_quantity -= 1;
      await ticket.save({ session });
    }

    // 3. Commit transaction nếu không có lỗi
    await session.commitTransaction();
    session.endSession();

    return {
      errCode: 0,
      message: "Order created successfully.",
      data: newOrder[0],
    };
  } catch (error) {
    // Rollback nếu có lỗi
    await session.abortTransaction();
    session.endSession();

    // Xóa đơn đặt nếu có lỗi xảy ra
    if (newOrder && newOrder[0] && newOrder[0]._id) {
      try {
        await Order.findByIdAndDelete(newOrder[0]._id);
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError.message);
      }
    }

    console.error("Error creating order:", error.message);
    return {
      errCode: 1,
      message: error.message,
    };
  }
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const updatedRowsCount = await Order.findByIdAndUpdate(orderId, orderData);
    if (!updatedRowsCount) {
      return {
        errCode: 2,
        message: "Order not found.",
      };
    }
    return {
      errCode: 0,
      message: "Order updated successfully.",
    };
  } catch (error) {
    console.error("Error updating order:", error.message);
    return {
      errCode: 1,
      message: "Unable to update order.",
    };
  }
};

export const deleteOrder = async (orderId) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    // 1. Lấy tất cả chi tiết đơn đặt
    const orderDetails = await OrderDetail.find({ order_id: orderId }).session(
      session
    );
    if (orderDetails.length === 0) {
      return {
        errCode: 2,
        message: "Order not found.",
      };
    }

    // 2. Tăng lại số lượng vé cho từng ticket trong chi tiết đơn
    for (const detail of orderDetails) {
      const ticket = await Ticket.findById(detail.ticket_id).session(session);
      if (!ticket) {
        throw new Error(`Ticket with ID ${detail.ticket_id} not found.`);
      }

      // Tăng số lượng vé lại
      ticket.ticket_quantity += 1;
      await ticket.save({ session });
    }

    // 3. Xóa chi tiết đơn đặt
    await OrderDetail.deleteMany({ order_id: orderId }).session(session);

    // 4. Xóa đơn đặt
    await Order.findByIdAndDelete(orderId).session(session);

    // 5. Commit transaction nếu không có lỗi
    await session.commitTransaction();
    session.endSession();

    return {
      errCode: 0,
      message: "Order deleted successfully.",
    };
  } catch (error) {
    // Rollback nếu có lỗi
    await session.abortTransaction();
    session.endSession();

    console.error("Error deleting order:", error.message);
    return {
      errCode: 1,
      message: "Unable to delete order.",
    };
  }
};
