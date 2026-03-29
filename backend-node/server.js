const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- Request Logger ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 3001;

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Health Check ---
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; // Quick DB check
    res.json({ status: 'OK', database: 'Connected', timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', database: err.message });
  }
});

// --- Public Routes ---
app.get('/api/public/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/home-section/:name', async (req, res) => {
  try {
    const section = await prisma.homeSection.findUnique({
      where: { sectionName: req.params.name }
    });
    if (section) res.json(section);
    else res.status(404).json({ error: 'Section not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/about', async (req, res) => {
  try {
    const about = await prisma.about.findFirst({ orderBy: { updatedAt: 'desc' } });
    if (about) res.json(about);
    else res.status(404).json({ error: 'About data not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Story Public Routes ---
app.get('/api/public/stories', async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { chapters: true } } }
    });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/stories/:id', async (req, res) => {
  try {
    const story = await prisma.story.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { chapters: { orderBy: { chapterNo: 'asc' } } }
    });
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/stories/:id/chapters/:chapterId', async (req, res) => {
  try {
    const chapter = await prisma.chapter.findFirst({
      where: { id: parseInt(req.params.chapterId), storyId: parseInt(req.params.id) },
      include: { story: { select: { id: true, title: true, chapters: { select: { id: true, chapterNo: true, title: true }, orderBy: { chapterNo: 'asc' } } } } }
    });
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New verification route
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// --- Admin Routes (Protected) ---
app.post('/api/admin/posts', authenticateToken, async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/posts/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Project Routes
app.post('/api/admin/projects', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Home Section Update
app.post('/api/admin/home-section', authenticateToken, async (req, res) => {
  try {
    const { sectionName, content } = req.body;
    const section = await prisma.homeSection.upsert({
      where: { sectionName },
      update: { content: typeof content === 'string' ? content : JSON.stringify(content) },
      create: { sectionName, content: typeof content === 'string' ? content : JSON.stringify(content) }
    });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// About Management
app.post('/api/admin/about', authenticateToken, async (req, res) => {
  try {
    const about = await prisma.about.create({ data: req.body });
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/about/:id', authenticateToken, async (req, res) => {
  try {
    const about = await prisma.about.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Story Admin Routes ---
app.post('/api/admin/stories', authenticateToken, async (req, res) => {
  try {
    const story = await prisma.story.create({ data: req.body });
    res.json(story);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.put('/api/admin/stories/:id', authenticateToken, async (req, res) => {
  try {
    const story = await prisma.story.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(story);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.delete('/api/admin/stories/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.story.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// --- Chapter Admin Routes ---
app.post('/api/admin/stories/:id/chapters', authenticateToken, async (req, res) => {
  try {
    const chapter = await prisma.chapter.create({
      data: { ...req.body, storyId: parseInt(req.params.id) }
    });
    res.json(chapter);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.put('/api/admin/chapters/:id', authenticateToken, async (req, res) => {
  try {
    const chapter = await prisma.chapter.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(chapter);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.delete('/api/admin/chapters/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.chapter.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
