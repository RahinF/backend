# video sharing app api

## Features
- Get videos of other users, subscribers, via tags and search as well as randomly and trending
- Users can like, unlike videos and comments as well as subscribe to other users
- Nested comments system
- JWT auth with login persistance

## Routes

All routes are accessed from `api/v1/[route]`

#### Auth

`POST` auth/login - login into account

`POST` auth/register - create account with email and password

`GET` auth/refresh - create new accessToken if refreshToken is still valid

`POST` auth/logout - resets JWT and cookies



#### Video

`POST` videos/ - create a video

`PUT` videos/:id - update a video

`DELETE` videos/:id - delete a video

`GET` videos/:subscriptions - get all videos of users subscribed to

`GET` videos/user/:id - get all videos by user

`GET` videos/find/:id - get a single video

`PUT` videos/view/:id - add view to video

`GET` videos/random - get random videos

`GET` videos/trending - get trending videos

`GET` videos/tags - get videos by tag

`GET` videos/search - get videos by search



#### Comment

`GET` comments/:videoId - get all comments 

`POST` comments/ - create a comment

`DELETE` comments/:id - delete a comment



#### User

`GET` users/find/:id - get a user

`PUT` users/:id - update a user

`DELETE` users/:id - delete a user

`PUT` users/:id/subscribe/:target - subscribe to user

`PUT` users/:id/unsubscribe/:target - unsubscribe from user

`PUT` users/:id/video/like/:videoId - like video

`PUT` users/:id/video/unlike/:videoId - unlike video

`PUT` users/:id/comment/like/:commentId - like comment

`PUT` users/:id/comment/unlike/:commentId - unlike comment
`


