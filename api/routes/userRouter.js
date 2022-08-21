const express            = require('express');
const { userController } = require('../controllers');

const router = express.Router();

// :8000/users/signup
// :8000/users/signin

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

module.exports = router;
