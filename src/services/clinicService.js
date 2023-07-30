const db = require("../models");
import { sequelize } from "../config/connectDB";

let createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHtml ||
        !data.descriptionMarkdown ||
        !data.address
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          image: data.imageBase64,
          descriptionHtml: data.descriptionHtml,
          descriptionMarkdown: data.descriptionMarkdown,
        });

        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll({});
      const clinicCount = await db.Clinic.count({});
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(
            item.image,
            "base64"
          ).toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
        data,
        clinicCount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllClinicDoctor = (inpId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inpId) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let data = await db.Clinic.findOne({
          where: {
            id: inpId,
          },
          attributes: [
            "address",
            "name",
            "descriptionHtml",
            "descriptionMarkdown",
            "htmlEn",
            "value_en",
            "markdownEn",
          ],
        });

        if (data) {
          let doctorClinic = {};

          doctorClinic = await db.Doctor_Infor.findAll({
            where: {
              clinicId: inpId,
            },
            attributes: ["doctorId"],
          });

          data.doctorClinic = doctorClinic;
        } else {
          data = {};
        }

        resolve({
          errCode: 0,
          errMessage: "OK",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleDeleteClinic = (cliId) => {
  return new Promise(async (resolve, reject) => {
    let clinic = await db.Clinic.findOne({
      where: { id: cliId },
    });
    if (!clinic) {
      resolve({
        errCode: 2,
        errMessage: `User doesn't exist`,
      });
    }
    await db.Clinic.destroy({
      where: { id: cliId },
    });

    resolve({
      errCode: 0,
      errMessage: `Delete success`,
    });
  });
};

let handleEditClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing para",
        });
      }
      let clinic = await db.Clinic.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (clinic) {
        clinic.name = data.name;
        clinic.address = data.address;
        clinic.descriptionHtml = data.descriptionHtml;
        clinic.descriptionMarkdown =
          data.descriptionMarkdown;
        clinic.value_en = data.value_en;
        clinic.htmlEn = data.htmlEn;
        clinic.markdownEn = data.markdownEn;
        if (data.imageBase64) {
          clinic.image = data.imageBase64;
        }
        await clinic.save();

        resolve({
          errCode: 0,
          message: "Update Success",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: `clinic doesn't found`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createClinic,
  getAllClinic,
  getAllClinicDoctor,
  handleDeleteClinic,
  handleEditClinic,
};
