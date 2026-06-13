const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Stylist = sequelize.define('Stylist', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  phone: { type: DataTypes.STRING(20) },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'stylists' });

module.exports = Stylist;
