const { userService } = require('../services')

const signUp = async (req, res) => {
  const { name, email, profileImage, password } = req.body;

	if ( !name || !email || !password || !profileImage ) {
		const error = new Error('KEY_ERROR')
		error.statusCode = 400

		throw error
	}
	
	try {
		const insertId = await userService.signUp(name, email, profileImage, password)
		res.status(201).json({ insertId });

	} catch (error) {
		res.status(error.statusCode).json({ message: error.message });
	}
}

const signIn = async (req, res) => {
	const { email, password } = req.body

	try {
		const accessToken = await userService.signIn(email, password)
		res.status(200).json({ accessToken })
	} catch (error) {
		res.status(error.statusCode).json({ message: error.message });
	}
}

module.exports = {
	signUp,
	signIn
}
