const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Owner = sequelize.define('Owner', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  phone: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(150) },
}, { tableName: 'owners' });

module.exports = Owner;
