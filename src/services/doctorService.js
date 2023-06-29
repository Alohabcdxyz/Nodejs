import db from "../models/index";
require("dotenv").config();
import _ from "lodash";
import emailService from "../services/emailService";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctor = (limitRecord) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitRecord,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["value_en", "value_vi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["value_en", "value_vi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });

      resolve({
        errCode: 0,
        data: doctor,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let checkRequiredField = (inpData) => {
  let arr = [
    "doctorId",
    "contentHtml",
    "contentMarkdown",
    "action",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "nameClinic",
    "addressClinic",
    "note",
    "specialtyId",
  ];
  let isValid = true;
  let element = "";
  for (let i = 0; i < arr.length; i++) {
    if (!inpData[arr[i]]) {
      isValid = false;
      element = arr[i];
      break;
    }
  }
  return {
    isValid: isValid,
    element: element,
  };
};

let saveInforDoctor = (inpData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredField(inpData);
      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing para ${checkObj.element}`,
        });
      } else {
        //Markdown
        if (inpData.action === "CREATE") {
          await db.Markdown.create({
            contentHtml: inpData.contentHtml,
            contentMarkdown: inpData.contentMarkdown,
            description: inpData.description,
            doctorId: inpData.doctorId,
          });
        }
        if (inpData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inpData.doctorId },
            raw: false,
          });

          if (doctorMarkdown) {
            doctorMarkdown.contentHtml =
              inpData.contentHtml;
            doctorMarkdown.contentMarkdown =
              inpData.contentMarkdown;
            doctorMarkdown.description =
              inpData.description;
            await doctorMarkdown.save();
          }
        }

        //doctor_infor
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inpData.doctorId,
          },
          raw: false,
        });

        if (doctorInfor) {
          //update infor
          doctorInfor.doctorId = inpData.doctorId;
          doctorInfor.priceId = inpData.selectedPrice;
          doctorInfor.provinceId = inpData.selectedProvince;
          doctorInfor.paymentId = inpData.selectedPayment;
          doctorInfor.nameClinic = inpData.nameClinic;
          doctorInfor.addressClinic = inpData.addressClinic;
          doctorInfor.note = inpData.note;
          doctorInfor.specialtyId = inpData.specialtyId;
          doctorInfor.clinicId = inpData.clinicId;
          await doctorInfor.save();
        } else {
          //create
          await db.Doctor_Infor.create({
            doctorId: inpData.doctorId,
            priceId: inpData.selectedPrice,
            provinceId: inpData.selectedProvince,
            paymentId: inpData.selectedPayment,
            nameClinic: inpData.nameClinic,
            addressClinic: inpData.addressClinic,
            note: inpData.note,
            specialtyId: inpData.specialtyId,
            clinicId: inpData.clinicId,
          });
        }
        resolve({
          errCode: 0,
          message: "Save Success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getInforDoctorById = (inpId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inpId) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inpId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: [
                "description",
                "contentHtml",
                "contentMarkdown",
              ],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["value_en", "value_vi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["value_en", "value_vi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["value_en", "value_vi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["value_en", "value_vi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(
            data.image,
            "base64"
          ).toString("binary");
        }

        if (!data) {
          data = {};
        }

        resolve({
          errCode: 0,
          data: data,
          message: "Save Success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.arrSchedule ||
        !data.doctorId ||
        !data.formattedDate
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }

        let existing = await db.Schedule.findAll({
          where: {
            doctorId: data.doctorId,
            date: data.formattedDate,
          },
          attributes: [
            "timeType",
            "date",
            "doctorId",
            "maxNumber",
          ],
          raw: true,
        });

        let toCreate = _.differenceWith(
          schedule,
          existing,
          (a, b) => {
            return (
              a.timeType === b.timeType &&
              +a.date === +b.date
            );
          }
        );

        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

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

let getScheduleDoctorByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["value_en", "value_vi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!dataSchedule) {
          dataSchedule = [];
        }
        resolve({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getExtraInforDoctorById = (idInp) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idInp) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: idInp,
          },
          attributes: {
            exclude: ["id", "doctorID"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceData",
              attributes: ["value_en", "value_vi"],
            },
            {
              model: db.Allcode,
              as: "paymentData",
              attributes: ["value_en", "value_vi"],
            },
            {
              model: db.Allcode,
              as: "provinceData",
              attributes: ["value_en", "value_vi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) {
          data = {};
        }
        resolve({
          errCode: 0,
          data: data,
          message: "Save Success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getProfileDoctorById = (inpId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inpId) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inpId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["value_en", "value_vi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["value_en", "value_vi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["value_en", "value_vi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["value_en", "value_vi"],
                },
                {
                  model: db.Specialty,
                  as: "specialtyData",
                  attributes: ["name"],
                },
              ],
            },
            {
              model: db.Markdown,
              attributes: [
                "description",
                "contentHtml",
                "contentMarkdown",
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(
            data.image,
            "base64"
          ).toString("binary");
        }

        if (!data) {
          data = {};
        }

        resolve({
          errCode: 0,
          data: data,
          message: "Save Success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getListBooking = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: [
                "email",
                "firstName",
                "address",
                "gender",
                "reason",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["value_en", "value_vi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataBooking",
              attributes: ["value_en", "value_vi"],
            },
            // {
            //   model: db.Doctor_Infor,
            //   include: [
            //     {
            //       model: db.Allcode,
            //       as: "priceData",
            //       attributes: ["value_en", "value_vi"],
            //     },
            //   ],
            //   where: { doctorId: doctorId },
            // },
          ],
          raw: false,
          nest: true,
        });

        resolve({
          errCode: 0,
          message: "Save Success",
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let sendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.patientId ||
        !data.timeType ||
        !data.imgBase64
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        //update status
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: "S2",
          },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
        }
        await emailService.sendAttachments(data);

        resolve({
          errCode: 0,
          message: "Save Success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getListBookingNotConfirm = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: "S1",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: [
                "email",
                "firstName",
                "address",
                "gender",
                "reason",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["value_en", "value_vi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataBooking",
              attributes: ["value_en", "value_vi"],
            },
          ],
          raw: false,
          nest: true,
        });

        resolve({
          errCode: 0,
          message: "Save Success",
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getListBookingDone = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: "S3",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: [
                "email",
                "firstName",
                "address",
                "gender",
                "reason",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["value_en", "value_vi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataBooking",
              attributes: ["value_en", "value_vi"],
            },
          ],
          raw: false,
          nest: true,
        });

        resolve({
          errCode: 0,
          message: "Save Success",
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getListBookingCancel = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: "S4",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: [
                "email",
                "firstName",
                "address",
                "gender",
                "reason",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["value_en", "value_vi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataBooking",
              attributes: ["value_en", "value_vi"],
            },
          ],
          raw: false,
          nest: true,
        });

        resolve({
          errCode: 0,
          message: "Save Success",
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let sendCancel = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.patientId ||
        !data.timeType ||
        !data.imgBase64
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        //update status
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: "S1",
          },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S4";
          await appointment.save();
        }
        await emailService.sendCancel(data);

        resolve({
          errCode: 0,
          message: "Save Success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctor,
  getAllDoctor,
  saveInforDoctor,
  getInforDoctorById,
  bulkCreateSchedule,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  getListBooking,
  sendRemedy,
  getListBookingDone,
  getListBookingNotConfirm,
  getListBookingCancel,
  sendCancel,
};
