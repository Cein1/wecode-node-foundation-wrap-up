const express = require('express');

const { postController } = require('../controllers');
const { loginRequired } = require('../utils/auth')
const router = express.Router();

router.get('/all', postController.getAllPosts)
router.get('', loginRequired, postController.getPosts)
router.post('', loginRequired, postController.createPost)
router.patch('/:postId', loginRequired, postController.updatePost)
router.delete('/:postId', loginRequired, postController.deletePost)

module.exports = router;
