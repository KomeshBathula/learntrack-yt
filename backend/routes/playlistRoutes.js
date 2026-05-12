const express = require('express');
const { addPlaylist, getPlaylists, getPlaylistDetails, deletePlaylist, toggleVisibility, getPublicPlaylists, clonePlaylist } = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/public', protect, getPublicPlaylists);

router.route('/')
    .post(protect, addPlaylist)
    .get(protect, getPlaylists);

router.put('/:id/visibility', protect, toggleVisibility);
router.post('/:id/clone', protect, clonePlaylist);

router.route('/:id')
    .get(protect, getPlaylistDetails)
    .delete(protect, deletePlaylist);

module.exports = router;
