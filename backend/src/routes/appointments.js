const express = require('express');
const router = express.Router();
const c = require('../controllers/appointmentsController');

router.get('/', c.getAll);
router.get('/today', c.getToday);
router.get('/:id', c.getById);
router.post('/', c.create);
router.put('/:id', c.update);
router.patch('/:id/status', c.updateStatus);
router.delete('/:id', c.remove);

module.exports = router;
