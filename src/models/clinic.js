"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clinic.hasMany(models.Doctor_Infor, {
        foreignKey: "clinicId",
        as: "clinicData",
      });
    }
  }
  Clinic.init(
    {
      address: DataTypes.STRING,
      name: DataTypes.STRING,
      descriptionHtml: DataTypes.TEXT,
      descriptionMarkdown: DataTypes.TEXT,
      image: DataTypes.TEXT,
      value_en: DataTypes.TEXT,
      htmlEn: DataTypes.TEXT,
      markdownEn: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Clinic",
    }
  );
  return Clinic;
};
