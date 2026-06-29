const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeaturedPosts = async (req, res) => {
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
};

const getProjects = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const projects = await prisma.project.findMany({
      where: filter
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHomeSection = async (req, res) => {
  try {
    const section = await prisma.homeSection.findUnique({
      where: { sectionName: req.params.name }
    });
    if (section) res.json(section);
    else res.json({ content: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAbout = async (req, res) => {
  try {
    const about = await prisma.about.findFirst({ orderBy: { updatedAt: 'desc' } });
    if (about) {
      res.json(about);
    } else {
      res.json({
        title: "The Studio",
        subtitle: "Our Creative Journey",
        tagsLine: "All glory to God",
        ourStoryTitle: "Our Story",
        description: "Describe your studio journey here...",
        subscribersCount: "1.09K+",
        videosCount: "105+",
        viewsCount: "274K+",
        communityText: "Rising",
        brandsList: "[]",
        joinTitle: "Join the Movement",
        joinYoutubeLink: "https://youtube.com/@dharanixstudio",
        joinInstagramLink: "https://www.instagram.com/visionofad",
        imageUrl: "",
        metaTitle: "",
        metaDescription: "",
        keywords: ""
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getContact = async (req, res) => {
  try {
    const contact = await prisma.contactPage.findFirst({ orderBy: { updatedAt: 'desc' } });
    if (!contact) return res.status(404).json({ error: 'Contact content not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createContactMessage = async (req, res) => {
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
};

const getFeaturedVideos = async (req, res) => {
  try {
    const videos = await prisma.featuredVideo.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' }
    });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPosts,
  getFeaturedPosts,
  getProjects,
  getHomeSection,
  getAbout,
  getContact,
  createContactMessage,
  getFeaturedVideos
};
