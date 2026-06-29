const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Account
router.put('/account', adminController.updateAccount);

// Posts
router.post('/posts', adminController.createPost);
router.put('/posts/:id', adminController.updatePost);
router.delete('/posts/:id', adminController.deletePost);

// Projects
router.post('/projects', adminController.createProject);
router.put('/projects/:id', adminController.updateProject);
router.delete('/projects/:id', adminController.deleteProject);

// Home Section
router.post('/home-section', adminController.upsertHomeSection);

// About
router.post('/about', adminController.createAbout);
router.put('/about/:id', adminController.updateAbout);

// Contact
router.post('/contact', adminController.createContact);
router.put('/contact/:id', adminController.updateContact);
router.delete('/contact/:id', adminController.deleteContact);

// Contact Messages
router.get('/contact-messages', adminController.getContactMessages);
router.put('/contact-messages/:id', adminController.updateContactMessage);
router.delete('/contact-messages/:id', adminController.deleteContactMessage);

// Featured Videos
router.get('/featured-videos', adminController.getFeaturedVideosAdmin);
router.post('/featured-videos', adminController.createFeaturedVideo);
router.put('/featured-videos/order', adminController.updateFeaturedVideosOrder);
router.put('/featured-videos/:id', adminController.updateFeaturedVideo);
router.delete('/featured-videos/:id', adminController.deleteFeaturedVideo);

module.exports = router;
