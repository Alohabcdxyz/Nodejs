import clinicService from "../services/clinicService";

let createClinic = async (req, res) => {
  try {
    let infor = await clinicService.createClinic(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllClinic = async (req, res) => {
  try {
    let infor = await clinicService.getAllClinic();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllClinicDoctor = async (req, res) => {
  try {
    let infor = await clinicService.getAllClinicDoctor(
      req.query.id
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

let handleDeleteClinic = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing para",
    });
  }
  let message = await clinicService.handleDeleteClinic(
    req.body.id
  );
  return res.status(200).json(message);
};

let handleEditClinic = async (req, res) => {
  let data = req.body;
  let message = await clinicService.handleEditClinic(data);
  return res.status(200).json(message);
};

module.exports = {
  createClinic,
  getAllClinic,
  getAllClinicDoctor,
  handleDeleteClinic,
  handleEditClinic,
};
