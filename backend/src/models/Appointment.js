const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pet_id: { type: DataTypes.INTEGER, allowNull: false },
  stylist_id: { type: DataTypes.INTEGER },
  appointment_date: { type: DataTypes.DATEONLY, allowNull: false },
  appointment_time: { type: DataTypes.TIME, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  status: {
    type: DataTypes.ENUM('pendiente', 'en_proceso', 'completado', 'cancelado'),
    defaultValue: 'pendiente',
  },
  before_image: { type: DataTypes.TEXT('long') },
  after_image: { type: DataTypes.TEXT('long') },
  notes: { type: DataTypes.TEXT },
}, { tableName: 'appointments' });

module.exports = Appointment;
