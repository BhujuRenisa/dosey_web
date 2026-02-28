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

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user.id, fullName: user.fullName },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
};