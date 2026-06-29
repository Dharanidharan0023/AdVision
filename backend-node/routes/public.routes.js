const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

router.get('/posts', publicController.getPosts);
router.get('/featured-posts', publicController.getFeaturedPosts);
router.get('/projects', publicController.getProjects);
router.get('/home-section/:name', publicController.getHomeSection);
router.get('/about', publicController.getAbout);
router.get('/contact', publicController.getContact);
router.post('/contact-messages', publicController.createContactMessage);
router.get('/featured-videos', publicController.getFeaturedVideos);

module.exports = router;
