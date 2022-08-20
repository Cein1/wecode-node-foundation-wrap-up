const { postService } = require('../services')
const { catchAsync }  = require('../utils/error')

const getAllPosts = catchAsync(async (req, res) => {
	try {
		const posts = await postService.getAllPosts();

		res.status(200).json({ data : posts });

	} catch (error) {
		res.status(error.statusCode).json({ message: error.message });
	}
})

const getPosts = catchAsync(async (req, res) => {
	const user = req.user

	try {
		const posts = await postService.getPostsByUser(user)
		res.status(200).json({ data: posts })
	} catch (error) {
		res.status(error.statusCode).json({ message: error.message });
	}
})

const createPost = catchAsync(async (req, res) => {
	const { title, content } = req.body
	const userId = req.user.id
	try {
		const insertId = await postService.createPost(title, content, userId)
		res.status(201).json({ insertId })
	} catch (error) {
		res.status(error.statusCode).json({ message: error.message });
	}
})

const updatePost = catchAsync(async (req, res) => {
	const { title, content } = req.body
	const postId = +req.params.postId
	const userId = req.user.id

	try {
		const post = await postService.updatePost(title, content, userId, postId)
		
		res.status(201).json({ post })
	} catch (error) {
		res.status(error.statusCode).json({ message: error.message });
	}
})

const deletePost = catchAsync(async (req, res) => {
	const postId = +req.params.postId
	const userId = req.user.id
	
	try {
		await postService.deletePost(postId, userId)

		res.status(204).send()
	} catch (error) {
		res.status(error.statusCode).json({ message: error.message });
	}
})

module.exports = {
	getAllPosts,
	getPosts,
	createPost,
	updatePost,
	deletePost
}
