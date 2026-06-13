const { Owner, Pet } = require('../models');

const getAll = async (req, res) => {
  try {
    const owners = await Owner.findAll({
      include: [{ model: Pet, as: 'pets', attributes: ['id', 'name', 'species', 'breed'] }],
      order: [['name', 'ASC']],
    });
    res.json(owners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id, {
      include: [{ model: Pet, as: 'pets' }],
    });
    if (!owner) return res.status(404).json({ error: 'Propietario no encontrado' });
    res.json(owner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const owner = await Owner.create(req.body);
    res.status(201).json(owner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ error: 'Propietario no encontrado' });
    await owner.update(req.body);
    res.json(owner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ error: 'Propietario no encontrado' });
    await owner.destroy();
    res.json({ message: 'Propietario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
