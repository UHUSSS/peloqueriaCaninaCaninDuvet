const { Appointment, Pet, Owner, Stylist } = require('../models');
const { Op } = require('sequelize');

const includeAll = [
  {
    model: Pet,
    as: 'pet',
    attributes: ['id', 'name', 'species', 'breed', 'alerts', 'color', 'size'],
    include: [{ model: Owner, as: 'owner', attributes: ['id', 'name', 'phone'] }],
  },
  { model: Stylist, as: 'stylist', attributes: ['id', 'name'] },
];

const getAll = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: includeAll,
      order: [['appointment_date', 'DESC'], ['appointment_time', 'ASC']],
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getToday = async (req, res) => {
  try {
    // Usar la zona horaria de Bogota (Colombia) para obtener la fecha correcta
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
    
    const appointments = await Appointment.findAll({
      where: { appointment_date: today },
      include: includeAll,
      order: [['appointment_time', 'ASC']],
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, { include: includeAll });
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    const full = await Appointment.findByPk(appointment.id, { include: includeAll });
    res.status(201).json(full);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    await appointment.update(req.body);
    const full = await Appointment.findByPk(appointment.id, { include: includeAll });
    res.json(full);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    await appointment.update({ status });
    const full = await Appointment.findByPk(appointment.id, { include: includeAll });
    res.json(full);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    await appointment.destroy();
    res.json({ message: 'Cita eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getToday, getById, create, update, updateStatus, remove };
