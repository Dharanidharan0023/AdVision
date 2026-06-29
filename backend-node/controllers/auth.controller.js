const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await prisma.user.findUnique({ where: { username } });

    let validPassword = false;

    if (user) {
      validPassword = await bcrypt.compare(password, user.password);
    }

    if (!validPassword || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verify = (req, res) => {
  res.json({ valid: true, user: req.user });
};

module.exports = { login, verify };
