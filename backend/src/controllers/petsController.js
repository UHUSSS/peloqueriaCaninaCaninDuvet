const { Pet, Owner, Appointment, Stylist } = require('../models');

const getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const where = search
      ? { name: { [require('sequelize').Op.like]: `%${search}%` } }
      : {};

    const pets = await Pet.findAll({
      where,
      include: [{ model: Owner, as: 'owner', attributes: ['id', 'name', 'phone', 'email'] }],
      order: [['name', 'ASC']],
    });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id, {
      include: [
        { model: Owner, as: 'owner' },
        {
          model: Appointment,
          as: 'appointments',
          include: [{ model: Stylist, as: 'stylist', attributes: ['id', 'name'] }],
          order: [['appointment_date', 'DESC'], ['appointment_time', 'DESC']],
        },
      ],
    });
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { pet_id: req.params.id },
      include: [{ model: Stylist, as: 'stylist', attributes: ['id', 'name'] }],
      order: [['appointment_date', 'DESC'], ['appointment_time', 'DESC']],
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    const full = await Pet.findByPk(pet.id, {
      include: [{ model: Owner, as: 'owner' }],
    });
    res.status(201).json(full);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });
    await pet.update(req.body);
    const full = await Pet.findByPk(pet.id, { include: [{ model: Owner, as: 'owner' }] });
    res.json(full);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });
    await pet.destroy();
    res.json({ message: 'Mascota eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, getHistory, create, update, remove };
