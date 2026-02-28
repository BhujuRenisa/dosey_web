const Medicine = require('../models/medicine');

// ADD Medicine
exports.addMedicine = async (req, res) => {
  try {
    const { name, dosage, frequency, time } = req.body;
    
    const medicine = await Medicine.create({
      name,
      dosage,
      frequency,
      time,
      userId: req.user.id, // req.user comes from authMiddleware
    });
    
    res.status(201).json(medicine);
  } catch (err) {
    console.error("Error adding medicine:", err);
    res.status(500).json({ message: 'Error adding medicine to database' });
  }
};

// GET All Medicines for logged-in user
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({ 
      where: { userId: req.user.id } 
    });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching medicines' });
  }
};