import Event from "../models/event.js";
import fs from "fs";
import path from "path";
import Organizer from "../models/organizer.js";
import Venue from "../models/venue.js";
import Ticket from "../models/ticket.js";
import TicketStatus from "../models/ticket_status.js";
import EventStatus from "../models/event_status.js";
import EventType from "../models/event_type.js";
import mongoose from "mongoose";
import TrendEvent from "../models/event_trend.js";
import SpecialEvent from "../models/event_special.js";
import Banner from "../models/banner.js";
import Order from "../models/order.js";
export const listEvents = async (filters) => {
  try {
    const filterConditions = {};

    // Lọc theo ngày diễn ra (start_date)
    if (filters.startDate) {
      filterConditions.start_date = { $gte: new Date(filters.startDate) }; // Ngày bắt đầu lớn hơn hoặc bằng startDate
    }

    // Lọc theo thể loại sự kiện (event_type)
    if (filters.eventType) {
      filterConditions.event_type_id = filters.eventType; // eventType là ID của loại sự kiện
    }

    // Lọc theo vị trí (venue.city)
    if (filters.City) {
      // Lọc tất cả các venue có city trùng với yêu cầu từ FE
      const venues = await Venue.find({ city: filters.City });

      // Nếu có ít nhất một venue có city trùng, lấy tất cả venue_ids
      if (venues.length > 0) {
        filterConditions.venue_id = { $in: venues.map((venue) => venue._id) }; // $in giúp tìm tất cả venue_id trùng
      } else {
        // Nếu không có venue nào, trả về kết quả rỗng
        filterConditions.venue_id = null;
      }
    }
    // Lọc sự kiện với các điều kiện đã tạo
    const events = await Event.find(filterConditions)
      .populate("venue_id") // Lấy tất cả thông tin của Venue
      .populate("organizer_id") // Lấy tất cả thông tin của Organizer
      .populate("event_status_id", "status_name") // Lấy thông tin event_status
      .populate("event_type_id", "type_name"); // Lấy thông tin event_type;

    // Nhóm các đơn đặt hàng theo event_id và tính tổng số tiền với điều kiện order_status_id = 675ea365101067cb13679b55
    const ordersTotalAmount = await Order.aggregate([
      {
        $match: {
          order_status_id: new mongoose.Types.ObjectId(
            "675ea365101067cb13679b55"
          ), // Lọc theo order_status_id
        },
      },
      {
        $group: {
          _id: "$event_id",
          totalAmount: { $sum: { $toDouble: "$total_amount" } }, // Chuyển Decimal128 thành số để tính toán
        },
      },
    ]);

    // Tạo một map để tra cứu nhanh tổng giá trị của từng sự kiện
    const orderTotalMap = new Map(
      ordersTotalAmount.map((order) => [
        order._id.toString(),
        order.totalAmount,
      ])
    );

    const eventsWithPricesAndTotals = await Promise.all(
      events.map(async (event) => {
        // Lấy danh sách vé liên quan đến sự kiện
        const tickets = await Ticket.find({ event_id: event._id });

        // Lấy giá vé tối thiểu
        const minPrice = tickets.reduce((min, ticket) => {
          const ticketPrice = parseFloat(ticket.price.toString());
          return ticketPrice < min ? ticketPrice : min;
        }, Infinity);

        // Tính tổng số tiền từ map
        const totalAmount = orderTotalMap.get(event._id.toString()) || 0;

        // Chuyển đổi danh sách vé thành thông tin chi tiết
        const ticketDetails = tickets.map((ticket) => ({
          ticket_type: ticket.ticket_type,
          price: parseFloat(ticket.price.toString()),
          ticket_status_id: ticket.ticket_status_id,
          ticket_des: ticket.ticket_des,
          ticket_quantity: ticket.ticket_quantity,
          event_datetime: ticket.event_datetime,
        }));

        return {
          ...event.toObject(),
          ticketPrice: minPrice === Infinity ? null : minPrice, // Nếu không có vé, giá vé là null
          event_total_amount: totalAmount, // Tổng giá trị các đơn đặt
          ticket_details: ticketDetails, // Thông tin chi tiết các vé
        };
      })
    );

    return {
      errCode: 0,
      message: "Success",
      data: eventsWithPricesAndTotals,
    };
  } catch (error) {
    console.error("Error fetching Events:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch Events.",
    };
  }
};

export const listEventsByUser = async (userId) => {
  try {
    // Bước 1: Tìm tất cả Organizer có user_id trùng với userId
    const organizers = await Organizer.find({ user_id: userId });

    if (organizers.length === 0) {
      return {
        errCode: 2,
        message: "No organizer found for the given user ID.",
      };
    }

    // Lấy tất cả các organizer_id từ danh sách organizers
    const organizerIds = organizers.map((organizer) => organizer._id);

    // Bước 2: Tìm tất cả Event có organizer_id trùng với các organizer_id
    const events = await Event.find({
      organizer_id: { $in: organizerIds },
    }).populate("venue_id"); // Populate để lấy thông tin venue;

    return {
      errCode: 0,
      message: "Success",
      events: events, // Trả về danh sách sự kiện
    };
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch events.",
      error: error.message,
    };
  }
};

export const getEventsByUserId = async (userId) => {
  try {
    // Bước 1: Tìm tất cả Organizer có user_id trùng với userId
    const organizers = await Organizer.find({ user_id: userId });

    if (organizers.length === 0) {
      return {
        errCode: 2,
        message: "No organizer found for the given user ID.",
      };
    }

    // Lấy tất cả các organizer_id từ danh sách organizers
    const organizerIds = organizers.map((organizer) => organizer._id);

    // Bước 2: Tìm tất cả Event có organizer_id trùng với các organizer_id
    const events = await Event.find({ organizer_id: { $in: organizerIds } });

    return {
      errCode: 0,
      message: "Success",
      events: events, // Trả về danh sách sự kiện
    };
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch events.",
      error: error.message,
    };
  }
};

// getEventById.js
export const getEventById = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
      .populate("venue_id") // Lấy tất cả thông tin của Venue
      .populate("organizer_id") // Lấy tất cả thông tin của Organizer
      .populate("event_status_id", "status_name") // Lấy thông tin event_status
      .populate("event_type_id", "type_name"); // Lấy thông tin event_type

    if (!event) {
      return {
        errCode: 2,
        id: eventId,
        message: "Event not found.",
      };
    }

    // Lấy danh sách vé liên quan đến sự kiện
    const tickets = await Ticket.find({ event_id: eventId }).populate(
      "ticket_status_id",
      "status_name"
    );

    return {
      errCode: 0,
      message: "Success",
      event: {
        ...event.toObject(),
        tickets: tickets.map((ticket) => ({
          id: ticket.id,
          ticketType: ticket.ticket_type,
          price: parseFloat(ticket.price.toString()),
          status: ticket.ticket_status_id?.status_name || "Unknown",
          description: ticket.ticket_des,
          quantity: ticket.ticket_quantity,
          datetime: ticket.event_datetime,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching Event:", error.message);
    return {
      errCode: 1,
      message: "Unable to fetch Event.",
    };
  }
};

export const createEvent = async (eventData) => {
  const session = await mongoose.startSession(); // Bắt đầu session cho transaction
  session.startTransaction(); // Bắt đầu transaction

  try {
    // 1. Tạo mới Organizer
    const organizer = {
      organizer_name: eventData.organizer_name,
      organizer_info: eventData.organizer_info,
      organizer_email: eventData.organizer_email,
      organizer_phone_number: eventData.organizer_phone_number,
      account_number: eventData.account_number,
      bank_name: eventData.bank_name,
      owner_name: eventData.owner_name,
      user_id: eventData.user_id,
    };
    const organizerInstance = await Organizer.create([organizer], { session });

    // 2. Tạo mới Venue
    const venue = {
      venue_name: eventData.venue_name,
      street_name: eventData.street_name,
      ward: eventData.ward,
      district: eventData.district,
      city: eventData.city,
    };
    const venueInstance = await Venue.create([venue], { session });

    // 3. Tạo mới Event
    const newEvent = {
      event_name: eventData.event_name,
      description: eventData.description,
      event_type_id: eventData.event_type_id,
      event_format: eventData.event_format,
      start_date: eventData.start_date,
      end_date: eventData.end_date,
      total_tickets: eventData.total_tickets,
      available_tickets: eventData.available_tickets,
      organizer_id: organizerInstance[0]._id,
      venue_id: venueInstance[0]._id,
      logo_url: eventData.logo_url,
      cover_image_url: eventData.cover_image_url,
    };
    const eventInstance = await Event.create([newEvent], { session });

    // 4. Tạo Tickets
    console.log("Vé này", eventData.tickets);
    const ticketPromises = JSON.parse(eventData.tickets).map((ticket) =>
      Ticket.create(
        [
          {
            ...ticket,
            event_id: eventInstance[0]._id,
          },
        ],
        { session }
      )
    );
    await Promise.all(ticketPromises);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      errCode: 0,
      message: "Event created successfully.",
      data: eventInstance[0],
    };
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating Event:", error.message);

    return {
      errCode: 1,
      error: error.message,
      message: "Unable to create Event.",
    };
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    // Tìm sự kiện cần cập nhật
    const event = await Event.findById(eventId)
      .populate("organizer_id")
      .populate("venue_id");

    if (!event) {
      return {
        errCode: 2,
        message: "Event not found",
      };
    }

    // Cập nhật thông tin về Organizer
    if (
      eventData.organizer_name ||
      eventData.organizer_info ||
      eventData.organizer_email ||
      eventData.organizer_phone_number
    ) {
      const updatedOrganizer = {
        organizer_name:
          eventData.organizer_name || event.organizer_id.organizer_name,
        organizer_info:
          eventData.organizer_info || event.organizer_id.organizer_info,
        organizer_email:
          eventData.organizer_email || event.organizer_id.organizer_email,
        organizer_phone_number:
          eventData.organizer_phone_number ||
          event.organizer_id.organizer_phone_number,
        account_number:
          eventData.account_number || event.organizer_id.account_number,
        bank_name: eventData.bank_name || event.organizer_id.bank_name,
        owner_name: eventData.owner_name || event.organizer_id.owner_name,
        user_id: eventData.user_id || event.organizer_id.user_id,
      };

      await Organizer.findByIdAndUpdate(
        event.organizer_id._id,
        updatedOrganizer
      );
    }

    // Cập nhật thông tin về Venue
    if (
      eventData.venue_name ||
      eventData.street_name ||
      eventData.ward ||
      eventData.district ||
      eventData.city
    ) {
      const updatedVenue = {
        venue_name: eventData.venue_name || event.venue_id.venue_name,
        street_name: eventData.street_name || event.venue_id.street_name,
        ward: eventData.ward || event.venue_id.ward,
        district: eventData.district || event.venue_id.district,
        city: eventData.city || event.venue_id.city,
      };

      await Venue.findByIdAndUpdate(event.venue_id._id, updatedVenue);
    }

    // Cập nhật thông tin event
    const { logo_url, cover_image_url } = event;

    // // Xóa hình ảnh cũ nếu có và thay bằng hình ảnh mới
    // if (logo_url) {
    //   const oldLogoPath = path.join("public/images", logo_url);
    //   if (fs.existsSync(oldLogoPath)) {
    //     fs.unlinkSync(oldLogoPath); // Xóa file cũ
    //   }
    // }

    // if (cover_image_url) {
    //   const oldCoverPath = path.join("public/images", cover_image_url);
    //   if (fs.existsSync(oldCoverPath)) {
    //     fs.unlinkSync(oldCoverPath); // Xóa file cũ
    //   }
    // }

    // Cập nhật thông tin event
    const updatedEventData = {
      event_name: eventData.event_name || event.event_name,
      description: eventData.description || event.description,
      event_type_id: eventData.event_type_id || event.event_type_id,
      event_status_id: eventData.event_status_id || event.event_status_id,
      event_format: eventData.event_format || event.event_format,
      start_date: eventData.start_date || event.start_date,
      end_date: eventData.end_date || event.end_date,
      total_tickets: eventData.total_tickets || event.total_tickets,
      available_tickets: eventData.available_tickets || event.available_tickets,
      organizer_id: event.organizer_id._id,
      venue_id: event.venue_id._id,
      paid: eventData.paid || "false",
      logo_url: eventData.logo_url,
      cover_image_url: eventData.cover_image_url,
    };

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updatedEventData
    );

    // Cập nhật thông tin các vé (tickets)
    if (eventData.tickets && eventData.tickets.length > 0) {
      // Lấy tất cả các vé hiện tại của sự kiện
      const existingTickets = await Ticket.find({ event_id: eventId });

      // Duyệt qua từng vé mới và cập nhật hoặc tạo mới nếu chưa có
      const ticketPromises = eventData.tickets.map(async (ticket) => {
        const existingTicket = existingTickets.find(
          (existing) => existing._id.toString() === ticket._id.toString()
        );

        if (existingTicket) {
          // Nếu vé đã tồn tại, cập nhật thông tin của vé
          const updatedTicket = {
            ticket_type: ticket.ticket_type || existingTicket.ticket_type,
            price: ticket.price || existingTicket.price,
            ticket_status_id:
              ticket.ticket_status_id || existingTicket.ticket_status_id,
            ticket_des: ticket.ticket_des || existingTicket.ticket_des,
            ticket_quantity:
              ticket.ticket_quantity || existingTicket.ticket_quantity,
            event_datetime:
              ticket.event_datetime || existingTicket.event_datetime,
          };

          // Cập nhật vé
          return Ticket.findByIdAndUpdate(existingTicket._id, updatedTicket, {
            new: true,
          });
        } else {
          // Nếu vé chưa tồn tại, tạo mới vé
          return Ticket.create({
            ...ticket,
            event_id: eventId, // Gán ID sự kiện cho vé mới
          });
        }
      });

      // Chờ tất cả các cập nhật/tạo mới vé
      await Promise.all(ticketPromises);
    }

    return {
      errCode: 0,
      message: "Event updated successfully.",
    };
  } catch (error) {
    console.error("Error updating Event:", error.message);
    return {
      errCode: 1,
      error: error.message,
      message: "Unable to update Event.",
    };
  }
};

export const deleteEvent = async (eventId) => {
  try {
    // Lấy sự kiện cần xóa
    const event = await Event.findById(eventId);

    if (!event) {
      return {
        errCode: 21,
        message: "Event not found.",
      };
    }

    // Lấy các hình ảnh cần xóa
    const { logo_url, cover_image_url } = event;

    // Xóa hình ảnh logo nếu có
    if (logo_url) {
      const oldLogoPath = path.join("public/images", logo_url);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath); // Xóa file cũ
      }
    }

    // Xóa hình ảnh cover image nếu có
    if (cover_image_url) {
      const oldCoverPath = path.join("public/images", cover_image_url);
      if (fs.existsSync(oldCoverPath)) {
        fs.unlinkSync(oldCoverPath); // Xóa file cũ
      }
    }

    // Xóa tất cả vé của sự kiện
    await Ticket.deleteMany({ event_id: eventId });

    // Xóa Venue nếu không còn sự kiện nào sử dụng
    await Venue.findByIdAndDelete(event.venue_id); // Xóa venue nếu không còn sự kiện nào
    // Xóa Organizer nếu không còn sự kiện nào sử dụng
    await Organizer.findByIdAndDelete(event.organizer_id); // Xóa organizer nếu không còn sự kiện nào

    // Xóa sự kiện
    const delete_event = await Event.findByIdAndDelete(eventId);
    if (!delete_event) {
      return {
        errCode: 2,
        message: "Event not found.",
      };
    }

    return {
      errCode: 0,
      message: "Event deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting Event:", error.message);
    return {
      errCode: 1,
      error: error.message,
      message: "Unable to delete Event.",
    };
  }
};

/// Trend

export const listTrendEvent = async () => {
  try {
    // Lấy danh sách các TrendEvent
    const trendEvents = await TrendEvent.find({}); // .lean() để giảm tải object Mongoose

    // Lấy danh sách EventId từ TrendEvent
    const eventIds = trendEvents.map((trend) => trend.Event_id);

    // Lấy thông tin chi tiết sự kiện
    const events = await Event.find({ _id: { $in: eventIds } })
      .select("_id event_name start_date cover_image_url logo_url")
      .lean();

    // Thêm thông tin giá vé thấp nhất
    const eventWithLowestPrice = await Promise.all(
      events.map(async (event) => {
        const lowestTicket = await Ticket.findOne({ event_id: event._id })
          .sort({ price: 1 }) // Sắp xếp theo giá tăng dần
          .select("price")
          .lean();

        return {
          ...event,
          lowest_price: lowestTicket
            ? parseFloat(lowestTicket.price.toString())
            : null, // Chuyển Decimal128 sang Number
        };
      })
    );

    return {
      errCode: 0,
      data: eventWithLowestPrice,
      message: "Successfully listed trend events.",
    };
  } catch (error) {
    console.error("Error listing TrendEvent:", error.message);
    return {
      errCode: 1,
      error: error.message,
      message: "Unable to list TrendEvent.",
    };
  }
};
export const addTrendEvent = async (EventId) => {
  try {
    // Kiểm tra xem EventId có tồn tại trong bảng Event
    const eventExists = await Event.findById(EventId);
    if (!eventExists) {
      return {
        errCode: 1,
        message: "Event does not exist.",
      };
    }

    // Kiểm tra xem EventId đã tồn tại trong bảng TrendEvent
    const trendExists = await TrendEvent.findOne({ Event_id: EventId });
    if (trendExists) {
      return {
        errCode: 2,
        message: "Event is already in the trend list.",
      };
    }

    // Thêm EventId vào bảng TrendEvent
    const newTrendEvent = new TrendEvent({ Event_id: EventId });
    await newTrendEvent.save();

    return {
      errCode: 0,
      message: "Event added to trend list successfully.",
    };
  } catch (error) {
    console.error("Error adding TrendEvent:", error.message);
    return {
      errCode: 3,
      error: error.message,
      message: "Unable to add Event to trend list.",
    };
  }
};

export const deleteTrendEvent = async (EventId) => {
  try {
    // Kiểm tra xem EventId có tồn tại trong bảng TrendEvent không
    const trendEventExists = await TrendEvent.findOne({ Event_id: EventId });
    if (!trendEventExists) {
      return {
        errCode: 1,
        message: "TrendEvent does not exist.",
      };
    }

    // Xóa TrendEvent với EventId
    await TrendEvent.deleteOne({ Event_id: EventId });

    return {
      errCode: 0,
      message: "TrendEvent deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting TrendEvent:", error.message);
    return {
      errCode: 2,
      error: error.message,
      message: "Unable to delete TrendEvent.",
    };
  }
};
/// Special
export const listSpecialEvent = async () => {
  try {
    // Lấy danh sách các SpecialEvent
    const specialEvents = await SpecialEvent.find({}); // Lấy tất cả SpecialEvent

    // Lấy danh sách EventId từ SpecialEvent
    const eventIds = specialEvents.map((special) => special.Event_id);

    // Lấy thông tin chi tiết sự kiện
    const events = await Event.find({ _id: { $in: eventIds } })
      .select("_id event_name start_date cover_image_url logo_url")
      .lean();

    // Thêm thông tin giá vé thấp nhất
    const eventWithLowestPrice = await Promise.all(
      events.map(async (event) => {
        const lowestTicket = await Ticket.findOne({ event_id: event._id })
          .sort({ price: 1 }) // Sắp xếp theo giá tăng dần
          .select("price")
          .lean();

        return {
          ...event,
          lowest_price: lowestTicket
            ? parseFloat(lowestTicket.price.toString())
            : null, // Chuyển Decimal128 sang Number
        };
      })
    );

    return {
      errCode: 0,
      data: eventWithLowestPrice,
      message: "Successfully listed special events.",
    };
  } catch (error) {
    console.error("Error listing SpecialEvent:", error.message);
    return {
      errCode: 1,
      error: error.message,
      message: "Unable to list SpecialEvent.",
    };
  }
};

export const addSpecialEvent = async (EventId) => {
  try {
    // Kiểm tra xem EventId có tồn tại trong bảng Event
    const eventExists = await Event.findById(EventId);
    if (!eventExists) {
      return {
        errCode: 1,
        message: "Event does not exist.",
      };
    }

    // Kiểm tra xem EventId đã tồn tại trong bảng SpecialEvent
    const specialExists = await SpecialEvent.findOne({ Event_id: EventId });
    if (specialExists) {
      return {
        errCode: 2,
        message: "Event is already in the special event list.",
      };
    }

    // Thêm EventId vào bảng SpecialEvent
    const newSpecialEvent = new SpecialEvent({ Event_id: EventId });
    await newSpecialEvent.save();

    return {
      errCode: 0,
      message: "Event added to special event list successfully.",
    };
  } catch (error) {
    console.error("Error adding SpecialEvent:", error.message);
    return {
      errCode: 3,
      error: error.message,
      message: "Unable to add Event to special event list.",
    };
  }
};

export const deleteSpecialEvent = async (EventId) => {
  try {
    // Kiểm tra xem EventId có tồn tại trong bảng SpecialEvent không
    const specialEventExists = await SpecialEvent.findOne({
      Event_id: EventId,
    });
    if (!specialEventExists) {
      return {
        errCode: 1,
        message: "SpecialEvent does not exist.",
      };
    }

    // Xóa SpecialEvent với EventId
    await SpecialEvent.deleteOne({ Event_id: EventId });

    return {
      errCode: 0,
      message: "SpecialEvent deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting SpecialEvent:", error.message);
    return {
      errCode: 2,
      error: error.message,
      message: "Unable to delete SpecialEvent.",
    };
  }
};
/// Banner

export const listBannerEvent = async () => {
  try {
    // Lấy danh sách các Banner
    const banners = await Banner.find({}); // Lấy tất cả Banner

    // Lấy danh sách EventId từ Banner
    const eventIds = banners.map((banner) => banner.Event_id);

    // Lấy thông tin chi tiết sự kiện
    const events = await Event.find({ _id: { $in: eventIds } })
      .select("_id event_name start_date cover_image_url logo_url")
      .lean();

    // Thêm thông tin giá vé thấp nhất
    const eventWithLowestPrice = await Promise.all(
      events.map(async (event) => {
        const lowestTicket = await Ticket.findOne({ event_id: event._id })
          .sort({ price: 1 }) // Sắp xếp theo giá tăng dần
          .select("price")
          .lean();

        return {
          ...event,
          lowest_price: lowestTicket
            ? parseFloat(lowestTicket.price.toString())
            : null, // Chuyển Decimal128 sang Number
        };
      })
    );

    return {
      errCode: 0,
      data: eventWithLowestPrice,
      message: "Successfully listed banners.",
    };
  } catch (error) {
    console.error("Error listing Banner:", error.message);
    return {
      errCode: 1,
      error: error.message,
      message: "Unable to list Banner.",
    };
  }
};

export const addBannerEvent = async (EventId) => {
  try {
    // Kiểm tra xem EventId có tồn tại trong bảng Event
    const eventExists = await Event.findById(EventId);
    if (!eventExists) {
      return {
        errCode: 1,
        message: "Event does not exist.",
      };
    }

    // Kiểm tra xem EventId đã tồn tại trong bảng Banner
    const bannerExists = await Banner.findOne({ Event_id: EventId });
    if (bannerExists) {
      return {
        errCode: 2,
        message: "Event is already in the banner list.",
      };
    }

    // Thêm EventId vào bảng Banner
    const newBanner = new Banner({ Event_id: EventId });
    await newBanner.save();

    return {
      errCode: 0,
      message: "Event added to banner list successfully.",
    };
  } catch (error) {
    console.error("Error adding BannerEvent:", error.message);
    return {
      errCode: 3,
      error: error.message,
      message: "Unable to add Event to banner list.",
    };
  }
};

export const deleteBannerEvent = async (EventId) => {
  try {
    // Kiểm tra xem EventId có tồn tại trong bảng Banner không
    const bannerExists = await Banner.findOne({ Event_id: EventId });
    if (!bannerExists) {
      return {
        errCode: 1,
        message: "Banner Event does not exist.",
      };
    }

    // Xóa Banner với EventId
    await Banner.deleteOne({ Event_id: EventId });

    return {
      errCode: 0,
      message: "Banner Event deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting Banner Event:", error.message);
    return {
      errCode: 2,
      error: error.message,
      message: "Unable to delete Banner Event.",
    };
  }
};
