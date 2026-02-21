const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Public Routes ---
app.get('/api/public/posts', async (req, res) => {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(posts);
});

app.get('/api/public/projects', async (req, res) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
});

app.get('/api/public/home-section/:name', async (req, res) => {
  const section = await prisma.homeSection.findUnique({
    where: { sectionName: req.params.name }
  });
  if (section) res.json(section);
  else res.status(404).json({ error: 'Not found' });
});

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const bcrypt = require('bcryptjs');
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// --- Admin Routes (Protected) ---
app.post('/api/admin/posts', authenticateToken, async (req, res) => {
  let { title, content, imageUrl, videoUrl, featured } = req.body;
  let videoId = null;

  if (videoUrl) {
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/)([\w-]{11}))/);
    if (match && match[1]) {
      videoId = match[1];
      if (!imageUrl) {
        imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      imageUrl,
      videoUrl,
      videoId,
      featured: featured || false
    }
  });
  res.json(post);
});

app.put('/api/admin/posts/:id', authenticateToken, async (req, res) => {
  const post = await prisma.post.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(post);
});

app.delete('/api/admin/posts/:id', authenticateToken, async (req, res) => {
  await prisma.post.delete({ where: { id: parseInt(req.params.id) } });
  res.sendStatus(204);
});

// Project Routes
app.post('/api/admin/projects', authenticateToken, async (req, res) => {
  const project = await prisma.project.create({ data: req.body });
  res.json(project);
});

app.put('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  const project = await prisma.project.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(project);
});

app.delete('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
  res.sendStatus(204);
});

// Home Section Update
app.post('/api/admin/home-section', authenticateToken, async (req, res) => {
  const { sectionName, content } = req.body;
  const section = await prisma.homeSection.upsert({
    where: { sectionName },
    update: { content },
    create: { sectionName, content }
  });
  res.json(section);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
