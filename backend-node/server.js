const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads', 'apks');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Security and Performance Middleware
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow cross-origin static file fetching (for APKs)
app.use(compression()); // Compress responses

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:3000', 'http://localhost:5173', 'http://10.132.192.235:3000'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json());

// Serve static files from the public/uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

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

app.get('/api/public/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/public/featured-posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const posts = await prisma.post.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
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

app.post('/api/public/contact-messages', async (req, res) => {
  try {
    const message = await prisma.contactMessage.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
      }
    });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Social Links Public Routes ---
app.get('/api/public/social-links', async (req, res) => {
  try {
    const links = await prisma.socialLink.findMany({ where: { isActive: true } });
    res.json(links);
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
// APK Upload Route
app.post('/api/admin/upload-apk', authenticateToken, upload.single('apk'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/apks/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// --- Contact Messages Admin Routes ---
app.get('/api/admin/contact-messages', authenticateToken, async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/contact-messages/:id', authenticateToken, async (req, res) => {
  try {
    const { isRead } = req.body;
    const message = await prisma.contactMessage.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead }
    });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/contact-messages/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.contactMessage.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/posts', authenticateToken, async (req, res) => {
  try {
    let { title, content, imageUrl, videoUrl, featured, slug, category, tags, status, publishDate } = req.body;
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
        featured: featured || false,
        slug,
        category,
        tags,
        status,
        publishDate: publishDate ? new Date(publishDate) : null
      }
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/posts/:id', authenticateToken, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.publishDate === '') data.publishDate = null;
    else if (data.publishDate) data.publishDate = new Date(data.publishDate);

    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data
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
    const data = { ...req.body };
    if (data.releaseDate === '') data.releaseDate = null;
    else if (data.releaseDate) data.releaseDate = new Date(data.releaseDate);

    const project = await prisma.project.create({ data });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Social Links Admin Routes ---
app.get('/api/admin/social-links', authenticateToken, async (req, res) => {
  try {
    const links = await prisma.socialLink.findMany();
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/social-links', authenticateToken, async (req, res) => {
  try {
    const linksData = req.body;
    if (!Array.isArray(linksData)) return res.status(400).json({ error: 'Expected array' });
    
    await prisma.$transaction(async (tx) => {
      const currentLinks = await tx.socialLink.findMany();
      const currentIds = currentLinks.map(l => l.id);
      
      const updatedIds = [];
      for (const link of linksData) {
        if (link.id) {
          await tx.socialLink.update({ 
            where: { id: link.id }, 
            data: { 
                platform: link.platform,
                type: link.type,
                url: link.url,
                label: link.label,
                isActive: link.isActive
            } 
          });
          updatedIds.push(link.id);
        } else {
          const newLink = await tx.socialLink.create({ 
              data: {
                  platform: link.platform,
                  type: link.type,
                  url: link.url,
                  label: link.label,
                  isActive: link.isActive
              } 
          });
          updatedIds.push(newLink.id);
        }
      }
      
      const idsToDelete = currentIds.filter(id => !updatedIds.includes(id));
      if (idsToDelete.length > 0) {
         await tx.socialLink.deleteMany({ where: { id: { in: idsToDelete } } });
      }
    });

    const updatedLinks = await prisma.socialLink.findMany();
    res.json(updatedLinks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.releaseDate === '') data.releaseDate = null;
    else if (data.releaseDate) data.releaseDate = new Date(data.releaseDate);

    const project = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data
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
