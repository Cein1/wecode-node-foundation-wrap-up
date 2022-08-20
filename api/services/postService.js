const { postDao } = require('../models')

const getAllPosts = async () => {
	return await postDao.getAllPosts()
}

const getPostsByUser = async (user) => {
	const posts = await postDao.getPostsByUserId(user.id)

	return {
		userId: user.id,
		userProfileImage: user.profileImage,
		posts: posts
	}
}

const createPost = async (title, content, userId) => {
	return await postDao.createPost(title, content, userId)
}

const deletePost = async (postId, userId) => {
	return await postDao.deletePost(postId, userId)
}

const updatePost = async (title, content, userId, postId) => {
	const post = await postDao.getPostById(postId)

	return await postDao.updatePost(
		title ? title : post.title,
		content ? content : post.content,
		userId, 
		postId
	)
}

module.exports = { 
	getAllPosts,
	getPostsByUser,
	createPost,
	updatePost,
	deletePost
}
