const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const { userService } = require('../services')

const { catchAsync } = require('../utils/error')

const loginRequired = catchAsync(async (req, res, next) => {

	// 1) Getting token and check of it's there
  const accessToken = req.headers.authorization

	if (!accessToken) {
		const error = new Error('NEED_ACCESS_TOKEN')
		error.statusCode = 401
		
		return next(error)
	}

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(accessToken, process.env.JWT_SECRET);

  // 3) Check if user still exists
	const user = await userService.getUserById(decoded.id)

	if (!user) {
		const error = new Error('USER_DOES_NOT_EXIST')
		error.statusCode = 404
		
		return next(error)
	}

  // 4) GRANT ACCESS
  req.user = user;
  next();
})

module.exports = { loginRequired }
