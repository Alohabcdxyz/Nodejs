require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nguyễn Tuấn Minh 👨‍⚕️" <nguyenminhdeptrai112233@gmail.com>', // sender address
    to: dataSend.recieverRmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: getBodyHtmlEmail(dataSend),
  });
};

let getBodyHtmlEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName} 👋</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Nguyễn Tuấn Minh App</p>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <h4>Thời gian: ${dataSend.time}</h4>
    <h4>Bác sĩ: ${dataSend.doctorName}</h4>
    <p>Nếu các thông tin trên là đúng sự thât, vui lòng nhấn vào link dưới đây để xác nhận và hoàn tất thủ tục thăm khám</p>
    <div>
    <a href=${dataSend.confirmLink} target="_blank">Click here</a></div>
    <p>Xin chân thành cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi ❤️</p>
    `;
  } else if (dataSend.language === "en") {
    result = `
    <h3>Dear ${dataSend.patientName} 👋</h3>
    <p>You received this email because you booked an online medical appointment on Nguyen Tuan Minh App</p>
    <p>Information to schedule an appointment:</p>
    <h4>Time: ${dataSend.time}</h4>
    <h4>Doctor: ${dataSend.doctorName}</h4>
    <p>If the above information is true, please click on the link below to confirm and complete the examination procedure.</p>
    <div>
    <a href=${dataSend.confirmLink} target="_blank">Click here</a></div>
    <p>Thank you very much for trusting and choosing us ❤️</p>
    `;
  }
  return result;
};

let sendAttachments = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nguyễn Tuấn Minh 👨‍⚕️" <nguyenminhdeptrai112233@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Kết quả đặt lịch khám bệnh", // Subject line
    html: getBodyHtmlEmailRemedy(dataSend),
    attachments: [
      {
        filename: `remedy-for-${
          dataSend.patientName
        }-${new Date().getTime()}.png`,
        content: dataSend.imgBase64.split(".")[1],
        encoding: "base64",
      },
    ],
  });
};

let getBodyHtmlEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName} 👋</h3>
    <p>Bạn nhận được email này vì đã khám bệnh thành công thông qua Nguyễn Tuấn Minh App</p>
    <p>Thông tin đơn thuốc được gửi trong file đính kèm</p>
    <p>Xin chân thành cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi ❤️</p>
    `;
  } else if (dataSend.language === "en") {
    result = `
    <h3>Dear ${dataSend.patientName} 👋</h3>
    <p>You received this email because of a successful medical examination through Nguyen Tuan Minh App</p>
    <p>Prescription information is included in the attachment</p>
    <p>Thank you very much for trusting and choosing us ❤️</p>
    `;
  }
  return result;
};

let sendCancel = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nguyễn Tuấn Minh 👨‍⚕️" <nguyenminhdeptrai112233@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Thông báo hủy lịch khám ⚠️", // Subject line
    html: getBodyHtmlEmailCancel(dataSend),
    attachments: [
      {
        filename: `remedy-for-${
          dataSend.patientName
        }-${new Date().getTime()}.png`,
        content: dataSend.imgBase64.split(".")[1],
        encoding: "base64",
      },
    ],
  });
};

let getBodyHtmlEmailCancel = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName} 👋</h3>
    <p>Bạn nhận được email này vì đã không xác nhận lịch khám</p>
    <p>Thông tin chi tiết được gửi trong file đính kèm</p>
    `;
  } else if (dataSend.language === "en") {
    result = `
    <h3>Hello ${dataSend.patientName} </h3>
    <p>You received this email because you did not confirm your appointment</p>
    <p>Details are sent in attachment</p>
    `;
  }
  return result;
};

module.exports = {
  sendSimpleEmail,
  getBodyHtmlEmailRemedy,
  sendAttachments,
  getBodyHtmlEmailCancel,
  sendCancel,
};
