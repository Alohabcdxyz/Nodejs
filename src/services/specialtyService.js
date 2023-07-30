const db = require("../models");
let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHtml ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
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

let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll({});
      const speCount = await db.Specialty.count({});
      if (data && data.length > 0) {
        data.map((item) => {
          // if (data !== null) {
          //   const bufferData = Buffer.from(data);
          //   // Rest of your code with the bufferData
          // } else {
          // item.image = new Buffer(
          //   item.image,
          //   "base64"
          // ).toString("binary");
          if (item.image !== null) {
            item.image = Buffer.from(
              item.image,
              "base64"
            ).toString("binary");
          }
          return item;
          // }
        });
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
        data,
        speCount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllSpecialtyDoctor = (inpId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inpId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: {
            id: inpId,
          },
          attributes: [
            "descriptionHtml",
            "descriptionMarkdown",
            "value_en",
            "htmlEn",
            "markdownEn",
          ],
        });

        if (data) {
          let doctorSpecialty = {};
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Infor.findAll(
              {
                where: {
                  specialtyId: inpId,
                },
                attributes: ["doctorId", "provinceId"],
              }
            );
          } else {
            doctorSpecialty = await db.Doctor_Infor.findAll(
              {
                where: {
                  specialtyId: inpId,
                  provinceId: location,
                },
                attributes: ["doctorId", "provinceId"],
              }
            );
          }
          data.doctorSpecialty = doctorSpecialty;
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

let handleDeleteSpe = (speId) => {
  return new Promise(async (resolve, reject) => {
    let spe = await db.Specialty.findOne({
      where: { id: speId },
    });
    if (!spe) {
      resolve({
        errCode: 2,
        errMessage: `User doesn't exist`,
      });
    }
    await db.Specialty.destroy({
      where: { id: speId },
    });

    resolve({
      errCode: 0,
      errMessage: `Delete success`,
    });
  });
};

let handleEditSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing para",
        });
      }
      let specialty = await db.Specialty.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (specialty) {
        specialty.name = data.name;
        specialty.descriptionHtml = data.descriptionHtml;
        specialty.descriptionMarkdown =
          data.descriptionMarkdown;
        specialty.value_en = data.value_en;
        specialty.htmlEn = data.htmlEn;
        specialty.markdownEn = data.markdownEn;
        if (data.imageBase64) {
          specialty.image = data.imageBase64;
        }
        await specialty.save();

        resolve({
          errCode: 0,
          message: "Update Success",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: `Specialty doesn't found`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createSpecialty,
  getAllSpecialty,
  getAllSpecialtyDoctor,
  handleDeleteSpe,
  handleEditSpecialty,
};
