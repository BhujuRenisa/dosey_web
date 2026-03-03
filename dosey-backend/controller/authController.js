const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER

exports.register = async (req, res) => {
  console.log("1. Backend received body:", req.body);

  try {
    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    console.log("2. User saved to DB:", newUser.id);

    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    console.error("3. ERROR DURING REGISTER:", err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// LOGIN

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[LOGIN] Attempting login for: ${email}`);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`[LOGIN] User not found: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`[LOGIN] Password match for ${email}: ${isMatch}`);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error(`[LOGIN] Error during login for ${req.body.email}:`, err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // assumed set by authMiddleware

    // 1. Delete user's medications
    const Medicine = require('../models/medicine');
    const MedicineHistory = require('../models/MedicineHistory');

    await MedicineHistory.destroy({ where: { userId } });
    await Medicine.destroy({ where: { userId } });

    // 2. Delete user
    await User.destroy({ where: { id: userId } });

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error("ERROR DURING DELETE ACCOUNT:", err);
    res.status(500).json({ message: 'Server error during account deletion' });
  }
};

// GET USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// UPDATE USER PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, dob, bloodType, emergencyContact, allergies } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({
      fullName: fullName || user.fullName,
      phone: phone !== undefined ? phone : user.phone,
      dob: dob !== undefined ? dob : user.dob,
      bloodType: bloodType !== undefined ? bloodType : user.bloodType,
      emergencyContact: emergencyContact !== undefined ? emergencyContact : user.emergencyContact,
      allergies: allergies !== undefined ? allergies : user.allergies,
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        bloodType: user.bloodType,
        emergencyContact: user.emergencyContact,
        allergies: user.allergies
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User with this email does not exist' });

    const crypto = require('crypto');
    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour

    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: expires
    });

    // In a real app, send an email. Here we return the token/link for simulation.
    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    res.json({
      message: 'Reset link generated (Simulated)',
      resetUrl,
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Error during forgot password process' });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const { Op } = require('sequelize');

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};