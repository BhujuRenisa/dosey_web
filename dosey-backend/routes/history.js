const express = require('express');
const router = express.Router();
const MedicineHistory = require('../models/MedicineHistory');
const authMiddleware = require('../middleware/authMiddleware');

// All routes protected
router.use(authMiddleware);

// GET all history for logged-in user (newest first)
router.get('/', async (req, res) => {
    try {
        const history = await MedicineHistory.findAll({
            where: { userId: req.user.id },
            order: [['takenAt', 'DESC'], ['createdAt', 'DESC']],
        });
        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching history' });
    }
});

// POST — mark a medicine as taken
router.post('/', async (req, res) => {
    try {
        const { medicineName, dosage, frequency, takenAt, takenTime, notes, medicineId } = req.body;
        if (!medicineName) return res.status(400).json({ message: 'Medicine name is required' });

        const entry = await MedicineHistory.create({
            medicineName,
            dosage,
            frequency,
            takenAt: takenAt || new Date().toISOString().split('T')[0],
            takenTime,
            notes,
            userId: req.user.id,
            medicineId: medicineId || null,
        });
        res.status(201).json(entry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error recording history' });
    }
});

// PUT — edit a history entry
router.put('/:id', async (req, res) => {
    try {
        const entry = await MedicineHistory.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!entry) return res.status(404).json({ message: 'History entry not found' });

        const { medicineName, dosage, frequency, takenAt, takenTime, notes } = req.body;
        await entry.update({ medicineName, dosage, frequency, takenAt, takenTime, notes });
        res.json(entry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating history entry' });
    }
});

// DELETE — remove a history entry
router.delete('/:id', async (req, res) => {
    try {
        const entry = await MedicineHistory.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!entry) return res.status(404).json({ message: 'History entry not found' });

        await entry.destroy();
        res.json({ message: 'History entry deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting history entry' });
    }
});

module.exports = router;
