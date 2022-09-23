import Comment from "../models/Comment.js";

// add comment
export const addComment = async (request, response, next) => {
  try {
    const comment = await Comment.create({ ...request.body });
    response.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// delete comment
export const deleteComment = async (request, response, next) => {
  try {
    const comment = await Comment.findById(request.params.id);
    
    // user must own comment delete their own comment
    if (!(request.user.id === comment.userId)) {
      return response.status(403).json("you can only delete your own comment");
    }

    await Comment.findByIdAndDelete(request.params.id);
    response.status(200).json("comment deleted");
  } catch (error) {
    next(error);
  }
};

// get comments
export const getComments = async (request, response, next) => {
  try {
    const comments = await Comment.find({ videoId: request.params.videoId });
    response.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
