const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { userDao } = require('../models')

const hashPassword = async (plaintextPassword) => {
	const saltRounds = 10; // ~10 hashes/sec
	const salt       = await bcrypt.genSalt(saltRounds);
	
	return await bcrypt.hash(plaintextPassword, salt);
}

const getUserById = async (id) => {
	return await userDao.getUserById(id)
}

const signUp = async (name, email, profileImage, password) => {
	const emailRegex    =/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
	const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
	
	if ( !name || !email || !password || !profileImage ) {
		const error = new Error('KEY_ERROR')
		error.statusCode = 400

		throw error
	}
	
	if (!emailRegex.test(email)) {
		const error = new Error('INVALID_EMAIL')
		error.statusCode = 400

		throw error
	}

	if (!passwordRegex.test(password)) {
		const error = new Error('INVALID_PASSWORD')
		error.statusCode = 400

		throw error
	}

	const hashedPassword = await hashPassword(password)

	return await userDao.createUser(name, email, profileImage, hashedPassword)
}

const signIn = async (email, password) => {
	const emailRegex    =/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
	const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
		
	if (!emailRegex.test(email)) {
		const error = new Error('INVALID_EMAIL')
		error.statusCode = 401

		throw error
	}

	if (!passwordRegex.test(password)) {
		const error = new Error('INVALID_PASSWORD')
		error.statusCode = 401

		throw error
	}

	const user = await userDao.getUserByEmail(email)

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		const error = new Error('WRONG_PASSWORD')
		error.statusCode = 401

		throw error
	}

	const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, 
		{ 
			algorithm: process.env.ALGORITHM, 
			expiresIn: process.env.JWT_EXPIRES_IN 
		}
	)

	return accessToken

}

module.exports = { 
	signUp, 
	signIn,
	getUserById
}
