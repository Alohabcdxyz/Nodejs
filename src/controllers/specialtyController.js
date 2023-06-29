import specialtyService from "../services/specialtyService";

let createSpecialty = async (req, res) => {
  try {
    let infor = await specialtyService.createSpecialty(
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

let getAllSpecialty = async (req, res) => {
  try {
    let infor = await specialtyService.getAllSpecialty();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllSpecialtyDoctor = async (req, res) => {
  try {
    let infor =
      await specialtyService.getAllSpecialtyDoctor(
        req.query.id,
        req.query.location
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

let handleDeleteSpe = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing para",
    });
  }
  let message = await specialtyService.handleDeleteSpe(
    req.body.id
  );
  return res.status(200).json(message);
};

let handleEditSpecialty = async (req, res) => {
  let data = req.body;
  let message = await specialtyService.handleEditSpecialty(
    data
  );
  return res.status(200).json(message);
};

module.exports = {
  createSpecialty,
  getAllSpecialty,
  getAllSpecialtyDoctor,
  handleDeleteSpe,
  handleEditSpecialty,
};
