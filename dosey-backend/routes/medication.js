const express = require('express');
const router = express.Router();
const Medicine = require('../models/medicine');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// ADD Medicine
router.post('/', async (req, res) => {
  try {
    const { name, dosage, unit, frequency, specificDays, time, reminderTimes, colorTag, shape, stock, refillThreshold } = req.body;
    const medicine = await Medicine.create({
      name, dosage, unit, frequency, specificDays, time, reminderTimes, colorTag, shape, stock, refillThreshold,
      userId: req.user.id,
    });
    res.status(201).json(medicine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding medicine' });
  }
});

// GET All Medicines for logged-in user
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.findAll({ where: { userId: req.user.id } });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching medicines' });
  }
});

// GET Medicine by ID
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching medicine' });
  }
});

// UPDATE Medicine by ID
router.put('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    const { name, dosage, unit, frequency, specificDays, time, reminderTimes, colorTag, shape, stock, refillThreshold } = req.body;
    await medicine.update({ name, dosage, unit, frequency, specificDays, time, reminderTimes, colorTag, shape, stock, refillThreshold });
    res.json(medicine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating medicine' });
  }
});

// DELETE Medicine by ID
router.delete('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    await medicine.destroy();
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting medicine' });
  }
});

module.exports = router;