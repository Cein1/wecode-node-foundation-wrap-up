# Foundation API wrap-up 
Express, TypeORM, Layered Pattern, Error Handling, 인증 & 인가 적용

## Project Structure
```
.
├── README.md
├── api
│   ├── controllers
│   │   ├── index.js
│   │   ├── postController.js
│   │   └── userController.js
│   ├── models
│   │   ├── dataSource.js
│   │   ├── index.js
│   │   ├── postDao.js
│   │   └── userDao.js
│   ├── routes
│   │   ├── index.js
│   │   ├── postRouter.js
│   │   └── userRouter.js
│   ├── services
│   │   ├── index.js
│   │   ├── postService.js
│   │   └── userService.js
│   └── utils
│       ├── auth.js
│       └── error.js
├── app.js
├── package-lock.json
└── package.json
```

## Endpoints
1. **회원가입 엔드포인트**

	*httpie 요청*
	```bash
	http -v POST http://127.0.0.1:8000/users/signup name='홍길동' email='hong@gmail.com' profileImage="http://test.jpeg" password='Passw0rd!'
	```

	*request message*

	```
	{
	  "email": "hong@gmail.com",
	  "name": "홍길동",
	  "password": "Passw0rd!",
	  "profileImage": "http://test.jpeg"
	}
	```

	*response message*
	```
	{
	  "insertId": 31
	}
	```
<br>

2. **로그인 엔드포인트**

	*httpie 요청*
	```bash
	http -v POST http://127.0.0.1:8000/users/signin email='hong@gmail.com' password='Passw0rd!'
	```
	*request message*

	```
	{
	  "email": "hong@gmail.com",
	  "password": "Passw0rd!",
	}
	```

	*response message*
	```
	{
	  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImlhdCI6MTY2MDg3MDMxNywiZXhwIjoxNjYxNjQ3OTE3fQ.0YZvHrgpztw_SPlwompjBsX1qD78asb8f6DgMOW44dM"
	}
	```
<br>

3. **게시물 목록 조회 엔드포인트**

	*httpie 요청*
	```bash
	http -v GET http://127.0.0.1:8000/posts/all
	```

	*response message*
	```
	{
	  "data": [
        {
          "content": "HTML과 CSS 익숙해지기..",
          "created_at": "2022-04-10T02:41:36.000Z",
          "id": 1,
          "title": "위코드 1일차",
          "updated_at": "2022-04-23T02:21:44.000Z",
          "user_id": 1
        },
        {
          "content": "Javascript 기본 문법 학습..",
          "created_at": "2022-04-18T02:41:36.000Z",
          "id": 2,
          "title": "위코드 2일차",
          "updated_at": "2022-04-23T02:21:54.000Z",
          "user_id": 1
        },
      ]
    }
	```
<br>

4. **게시글 등록 엔드포인트**

	*httpie 요청*
	```bash
	http -v POST http://127.0.0.1:8000/posts title='테스트' content='테스트 게시물 입니다.' Authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImlhdCI6MTY2MDg3MDMxNywiZXhwIjoxNjYxNjQ3OTE3fQ.0YZvHrgpztw_SPlwompjBsX1qD78asb8f6DgMOW44dM'
	```

	*request message*
	```
	{
      "title": "테스트",
      "content": "테스트 게시물 입니다."
	}
	```

	*response message*
	```
	{ "insertId" : 18 }
	```
<br>

5. **유저의 게시글 조회하기 엔드포인트**

	*httpie 요청*
	```bash
	http -v GET http://127.0.0.1:8000/posts 'Authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImlhdCI6MTY2MDg3MDMxNywiZXhwIjoxNjYxNjQ3OTE3fQ.0YZvHrgpztw_SPlwompjBsX1qD78asb8f6DgMOW44dM'
	```

	*response message*
	```json
		{
		    "data": {
			"userId": 30,
			"userProfileImage": "http://..."
			"posts": [
			    {
				"content": "blablabla",
				"created_at": "2022-08-14T23:21:19.000Z",
				"id": 8,
				"title": "new",
				"updated_at": null,
				"user_id": 30
			    },
			    {
				"content": "blablabla",
				"created_at": "2022-08-14T23:22:56.000Z",
				"id": 9,
				"title": "new",
				"updated_at": null,
				"user_id": 30
			    },
			    {
				"content": "blablabla",
				"created_at": "2022-08-14T23:24:21.000Z",
				"id": 10,
				"title": "new",
				"updated_at": null,
				"user_id": 30
			    },
			    {
				"content": "blablabla",
				"created_at": "2022-08-14T23:25:33.000Z",
				"id": 11,
				"title": "new",
				"updated_at": null,
				"user_id": 30
			    }
			],
		    }
		}
	```
<br>

6. **게시글 수정 엔드포인트**

	*httpie 요청*
	```bash
	http -v PATCH http://127.0.0.1:8000/posts/14 content='only content' Authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsImlhdCI6MTY2MDUxNzk5MSwiZXhwIjoxNjYxMjk1NTkxfQ.R87ap8Hl7lTnPPgdWeIMgE5goaf6enkEkdK72rjxkoQ'
	http -v PATCH http://127.0.0.1:8000/posts/14 title='only title' Authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsImlhdCI6MTY2MDUxNzk5MSwiZXhwIjoxNjYxMjk1NTkxfQ.R87ap8Hl7lTnPPgdWeIMgE5goaf6enkEkdK72rjxkoQ'
	http -v PATCH http://127.0.0.1:8000/posts/14 title='only title' content='only title' Authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsImlhdCI6MTY2MDUxNzk5MSwiZXhwIjoxNjYxMjk1NTkxfQ.R87ap8Hl7lTnPPgdWeIMgE5goaf6enkEkdK72rjxkoQ'
	```

	*request message*
	```
	{
      "title": "only title",
	}
	or
	{
      "content": "only content"
	}
	or
	{
      "title": "only title",
      "content": "only content"
	}
	```

	*response message*
	```
	{
	  "id": 1,
	  "title": "위코드 1일차",
	  "content": "HTML과 CSS 익숙해지기..",
	  "user_id": 1,
	  "created_at": "2022-04-10T02:41:36.000Z",
	  "updated_at": "2022-04-23T02:21:44.000Z",
	}
	```
<br>

7. **게시글 삭제 엔드포인트**

	*httpie 요청*
	```bash
	http -v DELETE http://127.0.0.1:8000/posts/12 Authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsImlhdCI6MTY2MDUxNzk5MSwiZXhwIjoxNjYxMjk1NTkxfQ.R87ap8Hl7lTnPPgdWeIMgE5goaf6enkEkdK72rjxkoQ'
	```
