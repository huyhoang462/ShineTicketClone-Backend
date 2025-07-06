import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} from "../middleware/JWT/Token.js";
import {
  createUser,
  deleteUser,
  editUser,
  ForgotPassword,
  getUser,
  handleUserAdminLogin,
  handleUserLogin,
  handleUserRegister,
  listUser,
  ResetPassword,
  Verify,
} from "../services/userService.js";

const handleRegister = async (req, res) => {
  const data = req.body;
  const result = await handleUserRegister(data);

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

let handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra input
  if (!email || !password) {
    return res.status(400).json({
      errCode: 1,
      message: "Missing inputs!",
    });
  }

  // Kiểm tra email và password
  const userData = await handleUserLogin(email, password);
  if (userData.errCode === 0) {
    // Gửi token khi đăng nhập thành công
    sendRefreshToken(res, userData.refreshToken); // Gửi refresh token trong cookie
    return res.status(200).json({
      errCode: 0,
      message: userData.message,
      data: userData,
      accessToken: userData.accessToken, // Trả access token cho client
    });
  }

  // Trả lỗi khi đăng nhập thất bại
  return res.status(400).json(userData);
};

const handleLoginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra input
  if (!email || !password) {
    return res.status(400).json({
      errCode: 1,
      message: "Missing inputs!",
    });
  }

  // Kiểm tra email và password
  const userData = await handleUserAdminLogin(email, password);
  if (userData.errCode === 0) {
    // Gửi token khi đăng nhập thành công
    sendRefreshToken(res, userData.refreshToken); // Gửi refresh token trong cookie
    return res.status(200).json({
      errCode: 0,
      message: userData.message,
      data: userData,
      accessToken: userData.accessToken, // Trả access token cho client
    });
  }

  // Trả lỗi khi đăng nhập thất bại
  return res.status(400).json(userData);
};

const handleLogout = async (req, res) => {
  res.clearCookie("refreshtoken");
  return res.status(200).json({
    errCode: 0,
    message: "log out success",
  });
};
const handleGetUser = async (req, res) => {
  const id = req.params.id; // all , id

  const user = await getUser(id);
  return res.status(user.errCode === 0 ? 200 : 400).json({
    user,
  });
};

// Account
const handleResetPassword = async (req, res) => {
  const Email = req.body.Email;
  const Password = req.body.Password;
  const NewPassword = req.body.NewPassword;
  const result = await ResetPassword(Email, Password, NewPassword);

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleForgotPassword = async (req, res) => {
  const Email = req.body.Email;
  const result = await ForgotPassword(Email);

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};
const handleVerify = async (req, res) => {
  const data = req.body;
  const result = await Verify(data);

  return res.status(result.errCode === 0 ? 200 : 400).json(result); // Trả về kết quả
};

const handleListUser = async (req, res) => {
  let listUsers = await listUser();
  return res.status(listUsers.errCode === 0 ? 200 : 400).json({
    listUsers,
  });
};

const handleCreateUser = async (req, res) => {
  let message = await createUser(req.body);
  console.log(message);
  return res.status(listUsers.errCode === 0 ? 200 : 400).json({
    message,
  });
};

const handleEditUser = async (req, res) => {
  let data = req.body;

  let message = await editUser(data);
  return res.status(message.errCode === 0 ? 200 : 400).json({
    message,
  });
};

const handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter id !",
    });
  }
  let message = await deleteUser(req.body.id);

  return res.status(message.errCode === 0 ? 200 : 400).json({
    message,
  });
};
export {
  handleRegister,
  handleLogin,
  handleGetUser,
  handleCreateUser,
  handleDeleteUser,
  handleEditUser,
  handleListUser,
  handleLogout,
  handleForgotPassword,
  handleResetPassword,
  handleVerify,
  handleLoginAdmin,
};
