const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Pet = sequelize.define('Pet', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  species: { type: DataTypes.ENUM('perro', 'gato', 'otro'), defaultValue: 'perro' },
  breed: { type: DataTypes.STRING(100) },
  weight: { type: DataTypes.DECIMAL(5, 2) },
  color: { type: DataTypes.STRING(80) },
  size: { type: DataTypes.ENUM('pequeño', 'mediano', 'grande', 'gigante'), defaultValue: 'mediano' },
  gender: { type: DataTypes.ENUM('macho', 'hembra'), defaultValue: 'macho' },
  age: { type: DataTypes.INTEGER },
  behavior: { type: DataTypes.STRING(200) },
  alerts: { type: DataTypes.TEXT },
  photo: { type: DataTypes.TEXT('long') },
}, { tableName: 'pets' });

module.exports = Pet;
