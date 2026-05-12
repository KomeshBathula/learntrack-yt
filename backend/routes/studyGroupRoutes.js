const express = require('express');
const { createGroup, joinGroup, getMyGroups, getGroupDetails } = require('../controllers/studyGroupController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createGroup);
router.post('/join', protect, joinGroup);
router.get('/', protect, getMyGroups);
router.get('/:id', protect, getGroupDetails);

module.exports = router;
