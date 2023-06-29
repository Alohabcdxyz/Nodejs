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

module.exports = {
  createHandbook,
  getAllHandbook,
  editHandbook,
};
