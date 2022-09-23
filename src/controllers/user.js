import User from "../models/User.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";
import bcrypt from "bcrypt";

// update user - userid in param
export const updateUser = async (request, response, next) => {
  const { name, email, password, bio, image } = request.body;

  try {

    let hashedPassword;
    if(password){

     hashedPassword = await bcrypt.hash(password, 10); // encrypt password
    }
    const user = await User.findByIdAndUpdate(
      request.params.id,
      { $set: { name, email, password: hashedPassword, bio, image } },
      { new: true }
    );
    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// delete user
export const deleteUser = async (request, response, next) => {
  try {
    await User.findByIdAndDelete(request.params.id);
    response.status(200).json("user has been deleted");
  } catch (error) {
    next(error);
  }
};

// get user
export const getUser = async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id);
    const { password, refreshToken, ...rest } = user._doc;
    response.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
// subscribe to other user - other user in params
export const subscribeToUser = async (request, response, next) => {
  try {
    await User.findByIdAndUpdate(request.user.id, {
      $addToSet: { subscriptions: request.params.target }, // add target user to subscription list
    });
    await User.findByIdAndUpdate(request.params.target, {
      $inc: { subscribers: 1 }, // increase target users subscribers
    });
    response.status(200).json("subscription successful");
  } catch (error) {
    next(error);
  }
};

// unsubscribe from other user
export const unsubscribeFromUser = async (request, response, next) => {
  try {
    await User.findByIdAndUpdate(request.user.id, {
      $pull: { subscriptions: request.params.target }, // remove target user to subscription list
    });
    await User.findByIdAndUpdate(request.params.target, {
      $inc: { subscribers: -1 }, // increase target users subscribers
    });
    response.status(200).json("unsubscription successful");
  } catch (error) {
    next(error);
  }
};

// like video
export const likeVideo = async (request, response, next) => {
  try {
    await Video.findByIdAndUpdate(request.params.videoId, {
      $addToSet: { likes: request.user.id },
    });
    response.status(200).json('video has been liked.')
  } catch (error) {
    next(error);
  }
};

// unlike video
export const unlikeVideo = async (request, response, next) => {
  try {
    await Video.findByIdAndUpdate(request.params.videoId, {
      $pull: { likes: request.user.id },
    });
    response.status(200).json('video has been disliked.')
  } catch (error) {
    next(error);
  }
};

// like comment
export const likeComment = async (request, response, next) => {
  try {
    await Comment.findByIdAndUpdate(request.params.commentId, {
      $addToSet: { likes: request.user.id },
    });
    response.status(200).json('video has been liked.')
  } catch (error) {
    next(error);
  }
};

// unlike comment
export const unlikeComment = async (request, response, next) => {
  try {
    await Comment.findByIdAndUpdate(request.params.commentId, {
      $pull: { likes: request.user.id },
    });
    response.status(200).json('video has been unliked.')
  } catch (error) {
    next(error);
  }
};