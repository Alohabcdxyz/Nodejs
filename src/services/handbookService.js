const db = require("../models");

let createHandbook = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHtml ||
        !data.descriptionMarkdown ||
        !data.status
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        await db.Handbook.create({
          name: data.name,
          status: 1,
          image: data.imageBase64,
          descriptionHtml: data.descriptionHtml,
          descriptionMarkdown: data.descriptionMarkdown,
          value_en: data.value_en,
          htmlEn: data.htmlEn,
          markdownEn: data.markdownEn,
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

let getAllHandbook = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Handbook.findAll();
      const handbookCount = await db.Handbook.count({});
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
        handbookCount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let editHandbook = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing para",
        });
      }
      let handbook = await db.Handbook.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (handbook) {
        handbook.name = data.name;
        handbook.value_en = data.value_en;
        handbook.htmlEn = data.htmlEn;
        handbook.markdownEn = data.markdownEn;
        handbook.descriptionHtml = data.descriptionHtml;
        handbook.descriptionMarkdown =
          data.descriptionMarkdown;
        handbook.status = data.status;
        if (data.imageBase64) {
          handbook.image = data.imageBase64;
        }
        await handbook.save();

        resolve({
          errCode: 0,
          message: "Update Success",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: `handbook doesn't found`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDetailHandbook = (inpId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inpId) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let data = await db.Handbook.findOne({
          where: {
            id: inpId,
          },
          attributes: [
            "descriptionHtml",
            "descriptionMarkdown",
            "name",
            "createdAt",
            "updatedAt",
            "value_en",
            "htmlEn",
            "markdownEn",
          ],
          include: [
            {
              model: db.User,
              as: "adminData",
              attributes: ["firstName", "lastName"],
              // where: {
              //   adminId: 1,
              // },
            },
          ],
          raw: false,
          nest: true,
        });

        // if (data) {
        //   let doctorSpecialty = {};
        //   if (location === "ALL") {
        //     doctorSpecialty = await db.Doctor_Infor.findAll(
        //       {
        //         where: {
        //           specialtyId: inpId,
        //         },
        //         attributes: ["doctorId", "provinceId"],
        //       }
        //     );
        //   } else {
        //     doctorSpecialty = await db.Doctor_Infor.findAll(
        //       {
        //         where: {
        //           specialtyId: inpId,
        //           provinceId: location,
        //         },
        //         attributes: ["doctorId", "provinceId"],
        //       }
        //     );
        //   }
        //   data.doctorSpecialty = doctorSpecialty;
        // } else {
        //   data = {};
        // }

        resolve({
          errCode: 0,
          errMessage: "OK",
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createHandbook,
  getAllHandbook,
  editHandbook,
  getAllDetailHandbook,
};
