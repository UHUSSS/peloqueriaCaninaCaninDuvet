const { Stylist } = require('../models');

const getAll = async (req, res) => {
  try {
    // Si se pasa ?all=true, devuelve activos e inactivos (para panel admin)
    const where = req.query.all === 'true' ? {} : { active: true };
    const stylists = await Stylist.findAll({ where, order: [['name', 'ASC']] });
    res.json(stylists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const create = async (req, res) => {
  try {
    const stylist = await Stylist.create(req.body);
    res.status(201).json(stylist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const stylist = await Stylist.findByPk(req.params.id);
    if (!stylist) return res.status(404).json({ error: 'Estilista no encontrado' });
    await stylist.update(req.body);
    res.json(stylist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const stylist = await Stylist.findByPk(req.params.id);
    if (!stylist) return res.status(404).json({ error: 'Estilista no encontrado' });
    await stylist.destroy();
    res.json({ message: 'Estilista eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, create, update, remove };

