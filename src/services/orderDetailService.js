import Order from "../models/order.js";
import OrderDetail from "../models/order_detail.js";

export const listOrderDetails = async (userId) => {
  try {
    // Tìm tất cả các đơn hàng theo userId
    const orders = await Order.find({ user_id: userId });

    // Kiểm tra nếu không có đơn hàng nào
    if (orders.length === 0) {
      return {
        errCode: 2,
        message: "No orders found for this user.",
        data: [],
      };
    }

    // Sử dụng Promise.all để lấy tất cả order_details cho từng đơn hàng
    const orderDetailsList = await Promise.all(
      orders.map(async (order) => {
        const orderDetails = await OrderDetail.find({ order_id: order._id });

        // Map các order_details và gắn thêm thông tin từ order
        return orderDetails.map((detail) => ({
          event_name: order.event_name,
          event_address: order.event_address,
          ticket_id: detail.ticket_id,
          ticket_type: detail.ticket_type,
          ticket_date: detail.ticket_date,
          price: detail.price.toString(), // Chuyển Decimal128 thành chuỗi
        }));
      })
    );

    // Gộp tất cả danh sách orderDetails thành một mảng duy nhất
    const flattenedDetails = orderDetailsList.flat();

    return {
      errCode: 0,
      message: "Order details fetched successfully.",
      data: flattenedDetails,
    };
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch order details.",
    };
  }
};

export const getOrderDetailById = async (orderDetailId) => {
  try {
    const orderDetail = await OrderDetails.findByPk(orderDetailId);
    if (!orderDetail) {
      return {
        errCode: 2,
        message: "Order detail not found with the given ID.",
      };
    }
    return {
      errCode: 0,
      message: "Order detail fetched successfully.",
      data: orderDetail,
    };
  } catch (error) {
    console.error("Error fetching order detail by ID:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch order detail.",
    };
  }
};

export const createOrderDetail = async (orderDetailData) => {
  try {
    const newOrderDetail = await OrderDetails.create(orderDetailData);
    return {
      errCode: 0,
      message: "Order detail created successfully.",
      data: newOrderDetail,
    };
  } catch (error) {
    console.error("Error creating order detail:", error.message);
    return {
      errCode: 1,
      message: "Unable to create order detail.",
    };
  }
};

export const updateOrderDetail = async (orderDetailId, orderDetailData) => {
  try {
    const [updatedRowsCount] = await OrderDetails.update(orderDetailData, {
      where: { order_detail_id: orderDetailId },
    });
    if (updatedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Order detail not found with the given ID for updating.",
      };
    }
    return {
      errCode: 0,
      message: "Order detail updated successfully.",
    };
  } catch (error) {
    console.error("Error updating order detail:", error.message);
    return {
      errCode: 1,
      message: "Unable to update order detail.",
    };
  }
};

export const deleteOrderDetail = async (orderDetailId) => {
  try {
    const deletedRowsCount = await OrderDetails.destroy({
      where: { order_detail_id: orderDetailId },
    });
    if (deletedRowsCount === 0) {
      return {
        errCode: 2,
        message: "Order detail not found with the given ID for deletion.",
      };
    }
    return {
      errCode: 0,
      message: "Order detail deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting order detail:", error.message);
    return {
      errCode: 1,
      message: "Unable to delete order detail.",
    };
  }
};
