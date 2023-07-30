module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "Handbooks", // table name
        "value_en", // new field name
        {
          type: Sequelize.TEXT,
          allowNull: true,
        }
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn("Handbooks", "value_en"),
    ]);
  },
};
