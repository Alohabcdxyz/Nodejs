import db from "../models/index";
import CRUDService from "../services/CRUDService";
let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let displayCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  return res.render("displayUser.ejs", {
    dataTable: data,
  });
};

let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("Post from server");
};

let editCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDService.getUserInforById(
      userId
    );
    return res.render("editCRUD.ejs", {
      user: userData,
    });
  } else {
    return res.send("No information");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUser = await CRUDService.updateUserData(data);
  return res.render("displayUser.ejs", {
    dataTable: allUser,
  });
};

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDService.deleteUserById(id);
  } else {
    return res.send("Not found");
  }
  let data = await CRUDService.getAllUser();
  return res.render("displayUser.ejs", {
    dataTable: data,
  });
};
module.exports = {
  getHomePage,
  getCRUD,
  postCRUD,
  displayCRUD,
  editCRUD,
  putCRUD,
  deleteCRUD,
};
