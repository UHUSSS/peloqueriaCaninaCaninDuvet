const express = require('express');
const router = express.Router();
const c = require('../controllers/petsController');

router.get('/', c.getAll);
router.get('/:id', c.getById);
router.get('/:id/history', c.getHistory);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
