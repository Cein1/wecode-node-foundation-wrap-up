const dataSource = require('./dataSource')

const getAllPosts = async () => await dataSource.query(`SELECT * FROM posts`)

const getPostById = async (postId) => {
	const result = await dataSource.query(`
		SELECT 
			id,
			title,
			content,
			user_id,
			created_at,
			updated_at
		FROM posts
		WHERE id = ?`, [postId]
	)

	return result[0]
}

const getPostsByUserId = async (userId) => {
	const results = await dataSource.query(`
		SELECT 
			id,
			title,
			content,
			user_id,
			created_at,
			updated_at
		FROM posts
		WHERE user_id = ?`, [userId]
	)

	return results
}


const deletePost = async (postId, userId) => {
	const deletedRows = (await dataSource.query(`
		DELETE FROM posts
		WHERE id=? AND user_id=?`, 
		[postId, userId]
	)).affectedRows

	if (deletedRows !== 0 && deletedRows !== 1) throw new Error('UNEXPECTED_NUMBER_OF_RECORDS_DELETED')
	
	return deletedRows
}

const createPost = async (title, content, userId) => {
	const result = await dataSource.query(`
		INSERT INTO posts (
			title,
			content,
			user_id
		) VALUES (
			?,
			?,
			?
		)`, [title, content, userId]
	)

	return result.insertId
}

const updatePost = async(title, content, userId, postId) => {
	const updatedRows = (await dataSource.query(`
		UPDATE posts
		SET title=?,
			content=?
		WHERE id=? AND user_id=?`, 
		[title, content, postId, userId]
	)).affectedRows

	if (updatedRows !== 1) throw new Error('UNEXPECTED_NUMBER_OF_RECORDS_UPDATED')

	const result = await dataSource.query(`
		SELECT
			p.id,
			p.title,
			p.content,
			u.id userId,
			u.name
		FROM posts p
		INNER JOIN users u ON u.id = p.user_id
		WHERE u.id = ? AND p.id = ?`, 
	  [userId, postId]
	)

	return result[0]
}

module.exports = { 
	getAllPosts,
	getPostById,
	getPostsByUserId,
	createPost,
	updatePost,
	deletePost
}
