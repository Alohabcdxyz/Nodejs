import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import handbookController from "../controllers/handbookController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);

  router.get("/test", (req, res) => {
    return res.send("test");
  });

  router.get("/crud", homeController.getCRUD);
  router.get("/get-crud", homeController.displayCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/edit-crud", homeController.editCRUD);
  router.post("/post-edit-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);
  router.post("/api/login", userController.handleLogin);
  router.get(
    "/api/get-all-user",
    userController.handleGetAllUser
  );
  router.post(
    "/api/create-new-user",
    userController.handleCreateNewUser
  );
  router.put(
    "/api/edit-user",
    userController.handleEditUser
  );
  router.delete(
    "/api/delete-user",
    userController.handleDeleteUser
  );
  router.get("/api/allcode", userController.getAllCode);
  router.get(
    "/api/top-doctor-home",
    doctorController.getTopDoctorHome
  );
  router.get(
    "/api/get-all-doctor",
    doctorController.getAllDoctor
  );
  router.post(
    "/api/save-infor-doctor",
    doctorController.postInforDoctor
  );
  router.get(
    "/api/get-infor-doctor",
    doctorController.getInforDoctor
  );
  router.post(
    "/api/bulk-create-schedule",
    doctorController.bulkCreateSchedule
  );
  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.getScheduleDoctorByDate
  );
  router.get(
    "/api/get-schedule-doctor-booking-by-date",
    doctorController.getScheduleDoctorBookingByDate
  );
  router.get(
    "/api/get-extra-infor-doctor-by-id",
    doctorController.getExtraInforDoctorById
  );
  router.get(
    "/api/get-profile-doctor",
    doctorController.getProfileDoctorById
  );
  router.post(
    "/api/patient-book-schedule",
    patientController.postBookAppointment
  );

  router.post(
    "/api/verify-patient-book-schedule",
    patientController.postVerifyBookAppointment
  );

  router.post(
    "/api/create-specialty",
    specialtyController.createSpecialty
  );
  router.get(
    "/api/get-all-specialty",
    specialtyController.getAllSpecialty
  );
  router.get(
    "/api/get-detail-specialty-doctor",
    specialtyController.getAllSpecialtyDoctor
  );

  router.post(
    "/api/create-clinic",
    clinicController.createClinic
  );
  router.get(
    "/api/get-all-clinic",
    clinicController.getAllClinic
  );
  router.get(
    "/api/get-detail-clinic-doctor",
    clinicController.getAllClinicDoctor
  );

  router.get(
    "/api/get-list-booking",
    doctorController.getListBooking
  );

  router.get(
    "/api/get-list-not-confirm-booking",
    doctorController.getListBookingNotConfirm
  );

  router.get(
    "/api/get-list-done-booking",
    doctorController.getListBookingDone
  );

  router.get(
    "/api/get-list-booking-cancel",
    doctorController.getListBookingCancel
  );

  router.post(
    "/api/send-remedy",
    doctorController.sendRemedy
  );

  router.post(
    "/api/send-cancel",
    doctorController.sendCancel
  );

  router.delete(
    "/api/delete-specialty",
    specialtyController.handleDeleteSpe
  );

  router.delete(
    "/api/delete-clinic",
    clinicController.handleDeleteClinic
  );

  router.put(
    "/api/edit-specialty",
    specialtyController.handleEditSpecialty
  );

  router.put(
    "/api/edit-clinic",
    clinicController.handleEditClinic
  );

  router.post(
    "/api/create-handbook",
    handbookController.createHandbook
  );
  router.get(
    "/api/get-all-handbook",
    handbookController.getAllHandbook
  );
  router.put(
    "/api/edit-handbook",
    handbookController.editHandbook
  );

  router.get(
    "/api/get-detail-handbook",
    handbookController.getAllDetailHandbook
  );

  return app.use("/", router);
};

module.exports = initWebRoutes;
