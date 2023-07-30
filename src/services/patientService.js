import db from "../models/index";
const { Op } = require("sequelize");
require("dotenv").config();
import emailService from "../services/emailService";
import { v4 as uuidv4 } from "uuid";
import doctorService from "./doctorService";

let BuildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let existingBooking = await db.Booking.findOne({
        where: {
          doctorId: data.doctorId,
          date: data.date,
          timeType: data.timeType,
        },
      });

      let existingBooking2 = await db.Booking.findAll({
        where: {
          doctorId: data.doctorId,
          date: data.date,
        },
      });

      console.log(existingBooking2);

      let info =
        await doctorService.getScheduleDoctorByDate(
          data.doctorId,
          data.date
        );

      console.log(info);
      if (existingBooking) {
        let existingTimeTypes = existingBooking2.map(
          (item) => item.timeType
        );
        let filterInfo = info.data.filter(
          (item) =>
            !existingTimeTypes.includes(item.timeType)
        );
        let timeValues = filterInfo.map(
          (item) => item.timeTypeData.valueEn
        );
        console.log(timeValues);
        let message =
          "Doctor has already been booked at this time. ";

        message += timeValues.join("\n");

        resolve({
          errCode: -1,
          errMessage: message,
          errResult: "already",
        });
      } else {
        if (
          !data.email ||
          !data.doctorId ||
          !data.date ||
          !data.timeType ||
          !data.fullName ||
          !data.selectedGender ||
          !data.address ||
          !data.phoneNumber ||
          !data.reason
        ) {
          resolve({
            errCode: 1,
            errMessage: "Missing para",
          });
        } else {
          let token = uuidv4();

          // await emailService.sendSimpleEmail({
          //   recieverRmail: data.email,
          //   patientName: data.fullName,
          //   time: data.timeString,
          //   doctorName: data.doctorName,
          //   language: data.language,
          //   confirmLink: BuildUrlEmail(data.doctorId, token),
          // });

          let user = await db.User.findOrCreate({
            where: { email: data.email },
            defaults: {
              email: data.email,
              roleId: "R3",
              gender: data.selectedGender,
              address: data.address,
              firstName: data.fullName,
              phoneNumber: data.phoneNumber,
              reason: data.reason,
            },
          });

          if (!user[1]) {
            // User already exists, create new reason
            await db.User.update(
              { reason: data.reason },
              { where: { email: data.email } }
            );
          }

          //create booking record
          if (user && user[0]) {
            // await db.Booking.findOrCreate({
            //   where: {
            //     [Op.and]: [
            //       { patientId: user[0].id },
            //       {
            //         [Op.or]: [
            //             { statusId: 'S1' },
            //             { statusId: 'S2' }
            //         ]
            //     }
            //     ],

            //   },
            //   defaults: {
            //     statusId: "S1",
            //     doctorId: data.doctorId,
            //     patientId: user[0].id,
            //     date: data.date,
            //     timeType: data.timeType,
            //     token: token,
            //   },
            // });

            let booking = await db.Booking.findOne({
              where: {
                [Op.and]: [
                  {
                    patientId: user[0].id,
                  },
                  {
                    [Op.or]: [
                      { statusId: "S1" },
                      { statusId: "S2" },
                    ],
                  },
                ],
              },
            });
            if (!booking) {
              await db.Booking.create({
                statusId: "S1",
                doctorId: data.doctorId,
                patientId: user[0].id,
                date: data.date,
                timeType: data.timeType,
                token: token,
              });
              await emailService.sendSimpleEmail({
                recieverRmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                confirmLink: BuildUrlEmail(
                  data.doctorId,
                  token
                ),
              });

              resolve({
                errCode: 0,
                errMessage: "Save infor doctor succeed!",
              });
            } else {
              resolve({
                errCode: 2,
                errMessage:
                  "You have an unfinished appointment, please check your mail!",
              });
            }
          }

          resolve({
            errCode: 0,
            errMessage: "Save infor patient success",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing para",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update appointment success",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage:
              "Appointment has been activated or does not exist",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointment,
  postVerifyBookAppointment,
};
