// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const signUp = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
    res.json({ token,user:{
      id:user.id,
      name:user.name,
      email:user.email,
      role:user.role,
      
  } });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "user already exist" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
    res.json({ token,user:{
      id:user.id,
      name:user.name,
      email:user.email,
      role:user.role,
      
  } });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'email/password does not match' });
  }
};
const getUser =(req, res) => {
    
    res.json(req.user);
    
  };
module.exports = { signUp, login, getUser };
