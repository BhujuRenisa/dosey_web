const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', contactController.getAllContacts);
router.post('/', contactController.addContact);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
