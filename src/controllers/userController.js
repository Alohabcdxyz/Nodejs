import UserService from "../services/UserService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Empty Parameter",
    });
  }

  let userData = await UserService.handleUserLogin(
    email,
    password
  );
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUser = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
      user: [],
    });
  }
  let user = await UserService.getAllUser(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "ok",
    user,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await UserService.createNewUser(req.body);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await UserService.editUser(data);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing para",
    });
  }
  let message = await UserService.deleteUser(req.body.id);
  return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
  try {
    let data = await UserService.getAllCodeService(
      req.query.type
    );
    return res.status(200).json(data);
  } catch (e) {
    console.log("get all code", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleLogin,
  handleGetAllUser,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
};
