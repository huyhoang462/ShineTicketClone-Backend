import express from "express";
import bodyParser from "body-parser";
// thư viện hỗ trợ lấy các tham số từ client gửi.  vd :query param
import viewEngine from "./config/viewEngine.js";
import initWebRoutes from "./routes/web.js";
import cors from "cors"; // Import thư viện cors
import dotenv from "dotenv"; // Sử dụng import
import cookieParser from "cookie-parser";
import Database from "./config/InitDB.js";
import path from "path";
dotenv.config(); // Gọi config

// config app
const app = express();
// Thiết lập CORS để cho phép các yêu cầu từ 'http://localhost:3000'
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Thay bằng URL của ứng dụng React của bạn
  })
);
app.use("/images", express.static(path.join(process.cwd(), "public/images")));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
viewEngine(app);

//   DB connection
// db connetion
Database.getInstance();

initWebRoutes(app);
//

let port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log("Sever is running on port ", port);
});

app.post("/refresh_token", async (req, res) => {
  const token = req.cookies.refreshtoken;
  if (!token) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    // Xác thực refresh token
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Lấy thông tin user từ database
    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Tạo AccessToken mới
    const newAccessToken = createAccessToken(user._id);
    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

const event = {
  event_name: "Live Concert 2024",
  description: "An exciting live music concert with top artists.",
  event_type_id: "675ff4348b3a1d6757de752e",
  organizer: {
    organizer_name: "Live Music Events",
    organizer_info: "We organize live music performances.",
    organizer_email: "contact@livemusicevents.com",
    organizer_phone_number: "098-765-4321",
  },
  venue: {
    venue_name: "Music Hall",
    street_name: "123 Concert St.",
    ward: "Music Ward",
    district: "Central District",
    city: "Hanoi",
  },
  event_status: "675ff4348b3a1d6757de752e",
  start_date: "2024-04-01T19:00:00Z",
  end_date: "2024-04-01T22:00:00Z",
  total_tickets: 1000,
  available_tickets: 1000,
  logo_url: "http://example.com/logo.png",
  cover_image_url: "http://example.com/cover.jpg",
  tickets: [
    {
      ticket_type: "VIP",
      price: "200.00",
      ticket_status_id: "675ff4348b3a1d6757de753f",
      ticket_image: "http://example.com/ticket-vip.png",
      ticket_des: "VIP ticket with exclusive seating and benefits.",
      ticket_quantity: 100,
      event_datetime: "2024-04-01T19:00:00Z",
    },
    {
      ticket_type: "Standard",
      price: "100.00",
      ticket_status_id: "675ff4348b3a1d6757de753f",
      ticket_image: "http://example.com/ticket-standard.png",
      ticket_des: "Standard ticket with general admission seating.",
      ticket_quantity: 500,
      event_datetime: "2024-04-01T19:00:00Z",
    },
    {
      ticket_type: "Economy",
      price: "50.00",
      ticket_status_id: "675ff4348b3a1d6757de753f",
      ticket_image: "http://example.com/ticket-economy.png",
      ticket_des: "Economy ticket with basic seating options.",
      ticket_quantity: 400,
      event_datetime: "2024-04-01T19:00:00Z",
    },
  ],
};
