const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Account management
const updateAccount = async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    const currentUsername = req.user.username;

    if (!currentPassword || (!newUsername && !newPassword)) {
      return res.status(400).json({ error: 'Provide current password and at least one new credential.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { username: currentUsername } });
    let passwordMatches = false;

    if (existingUser) {
      passwordMatches = await bcrypt.compare(currentPassword, existingUser.password);
    }

    if (!passwordMatches) {
      return res.status(403).json({ error: 'Current password is incorrect.' });
    }

    const updatedData = {};
    if (newPassword) {
      updatedData.password = await bcrypt.hash(newPassword, 10);
    }
    const finalUsername = newUsername ? newUsername.trim() : currentUsername;

    if (newUsername && newUsername !== currentUsername) {
      const alreadyExists = await prisma.user.findUnique({ where: { username: finalUsername } });
      if (alreadyExists) {
        return res.status(409).json({ error: 'Username already exists.' });
      }
      updatedData.username = finalUsername;
    }

    let user;
    if (existingUser) {
      user = await prisma.user.update({ where: { id: existingUser.id }, data: updatedData });
    } else {
      user = await prisma.user.create({
        data: {
          username: finalUsername,
          password: updatedData.password || await bcrypt.hash(currentPassword, 10),
          role: 'ROLE_ADMIN'
        }
      });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    res.json({ user: { username: user.username, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Posts
const createPost = async (req, res) => {
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

    const postData = { ...req.body, videoId };
    if (postData.publishDate) {
      postData.publishDate = new Date(postData.publishDate);
    }
    const post = await prisma.post.create({
      data: postData
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postData = { ...req.body };
    if (postData.publishDate) {
      postData.publishDate = new Date(postData.publishDate);
    }
    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: postData
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Projects
const createProject = async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (projectData.releaseDate) {
      projectData.releaseDate = new Date(projectData.releaseDate);
    }
    const project = await prisma.project.create({ data: projectData });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (projectData.releaseDate) {
      projectData.releaseDate = new Date(projectData.releaseDate);
    }
    const project = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: projectData
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Home Section Update
const upsertHomeSection = async (req, res) => {
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
};

// About Management
const createAbout = async (req, res) => {
  try {
    const about = await prisma.about.create({ data: req.body });
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAbout = async (req, res) => {
  try {
    const about = await prisma.about.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Contact Page Management
const createContact = async (req, res) => {
  try {
    const data = {
      pageTitle: req.body.pageTitle,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      googleMapUrl: req.body.googleMapUrl,
      businessHours: req.body.businessHours,
      socialLinks: typeof req.body.socialLinks === 'string' ? req.body.socialLinks : JSON.stringify(req.body.socialLinks || {}),
      contactFormEnabled: req.body.contactFormEnabled ?? true,
      contactFormNote: req.body.contactFormNote
    };

    if (req.body.id) {
      const contact = await prisma.contactPage.update({
        where: { id: parseInt(req.body.id) },
        data
      });
      return res.json(contact);
    }

    const contact = await prisma.contactPage.create({ data });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await prisma.contactPage.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...req.body,
        socialLinks: typeof req.body.socialLinks === 'string' ? req.body.socialLinks : JSON.stringify(req.body.socialLinks || {})
      }
    });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    await prisma.contactPage.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Contact Messages
const getContactMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateContactMessage = async (req, res) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead: req.body.isRead }
    });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteContactMessage = async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Featured Videos Routes
const getFeaturedVideosAdmin = async (req, res) => {
  try {
    const videos = await prisma.featuredVideo.findMany({ orderBy: { displayOrder: 'asc' } });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createFeaturedVideo = async (req, res) => {
  try {
    const video = await prisma.featuredVideo.create({
      data: {
        title: req.body.title,
        videoUrl: req.body.videoUrl,
        thumbnailUrl: req.body.thumbnailUrl,
        description: req.body.description,
        displayOrder: req.body.displayOrder ?? 0,
        active: req.body.active ?? true
      }
    });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateFeaturedVideo = async (req, res) => {
  try {
    const video = await prisma.featuredVideo.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title: req.body.title,
        videoUrl: req.body.videoUrl,
        thumbnailUrl: req.body.thumbnailUrl,
        description: req.body.description,
        displayOrder: req.body.displayOrder,
        active: req.body.active
      }
    });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteFeaturedVideo = async (req, res) => {
  try {
    await prisma.featuredVideo.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateFeaturedVideosOrder = async (req, res) => {
  try {
    const updates = req.body.items || [];
    const operations = updates.map((item) =>
      prisma.featuredVideo.update({
        where: { id: parseInt(item.id) },
        data: { displayOrder: parseInt(item.displayOrder) }
      })
    );
    await prisma.$transaction(operations);
    const videos = await prisma.featuredVideo.findMany({ orderBy: { displayOrder: 'asc' } });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  updateAccount,
  createPost, updatePost, deletePost,
  createProject, updateProject, deleteProject,
  upsertHomeSection,
  createAbout, updateAbout,
  createContact, updateContact, deleteContact,
  getContactMessages, updateContactMessage, deleteContactMessage,
  getFeaturedVideosAdmin, createFeaturedVideo, updateFeaturedVideo, deleteFeaturedVideo, updateFeaturedVideosOrder
};
