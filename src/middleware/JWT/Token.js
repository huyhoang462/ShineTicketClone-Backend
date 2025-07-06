import jwt from "jsonwebtoken";
const { sign } = jwt;

const createAccessToken = (userId) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "200m",
  });
};

const createRefreshToken = (userId) => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
const sendAccessToken = (res, req, access_token) => {
  res.send({
    access_token,
    email: req.body.email,
  });
};

const sendRefreshToken = (res, refreshtoken) => {
  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    path: "/refresh_token",
  });
};

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshtoken;

  // Kiểm tra token trong cookie
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided!" });
  }

  try {
    // Xác thực `RefreshToken`
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Kiểm tra user trong DB (nếu cần)
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    // Tạo `AccessToken` mới
    const newAccessToken = createAccessToken(user._id);

    // Trả về `AccessToken` mới
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token!" });
  }
};

export {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  refreshToken,
};
