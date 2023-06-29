import handbookService from "../services/handbookService";

let createHandbook = async (req, res) => {
  try {
    let infor = await handbookService.createHandbook(
      req.body
    );
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllHandbook = async (req, res) => {
  try {
    let infor = await handbookService.getAllHandbook();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let editHandbook = async (req, res) => {
  let data = req.body;
  let message = await handbookService.editHandbook(data);
  return res.status(200).json(message);
};

module.exports = {
  createHandbook,
  getAllHandbook,
  editHandbook,
};
