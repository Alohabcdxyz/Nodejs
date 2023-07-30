"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Handbook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Handbook.belongsTo(models.User, {
        foreignKey: "adminId",
        targetKey: "id",
        as: "adminData",
      });
    }
  }
  Handbook.init(
    {
      name: DataTypes.STRING,
      descriptionHtml: DataTypes.TEXT,
      descriptionMarkdown: DataTypes.TEXT,
      image: DataTypes.TEXT,
      status: DataTypes.INTEGER,
      value_en: DataTypes.TEXT,
      htmlEn: DataTypes.TEXT,
      markdownEn: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Handbook",
    }
  );
  return Handbook;
};
