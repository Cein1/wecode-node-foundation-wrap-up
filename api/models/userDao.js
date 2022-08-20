const dataSource = require('./dataSource')

const createUser = async (name, email, profileImage, password) => {
  const result = await dataSource.query(`
	  INSERT INTO users (
				name, 
				email, 
				profile_image, 
				password
		) VALUES (
				?,
				?, 
				?, 
				?
		)`,
    [name, email, profileImage, password]
  )

	return result.insertId
}

const getUserByEmail = async (email) => {
	const result = await dataSource.query(`
		SELECT 
			id,
			name,
			email,
			password,
			profile_image AS profileImage
		FROM users
		WHERE email=?`, [email]
	)

	return result[0]
}

const getUserById = async (id) => {
	const result = await dataSource.query(`
		SELECT 
			id,
			name,
			email,
			password,
			profile_image AS profileImage
		FROM users
		WHERE id=?`, [id]
	)

	return result[0]
}

module.exports = { 
	createUser,
	getUserByEmail,
	getUserById
}
