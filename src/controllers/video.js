import Video from "../models/Video.js";
import User from "../models/User.js";

// add video
export const addVideo = async (request, response, next) => {
  const { userId, title, duration, description, imageUrl, videoUrl, tags } = request.body;
  try {
    const video = await Video.create({ userId, title, description, duration, imageUrl, videoUrl, tags });
    response.status(201).json(video);
  } catch (error) {
    next(error);
  }
};
// update video
export const updateVideo = async (request, response, next) => {
  const { title, description, imageUrl, tags } = request.body;

  
  try {

    const video = await Video.findById(request.params.id);
    if (!video) return response.status(404).json("Video not found!");
    if (!request.user.id === video.userId) return response.status(403).json("You can update only your video!");

    const updatedVideo = await Video.findByIdAndUpdate(
      request.params.id,
      { $set: { title, description, imageUrl, tags } },
      { new: true }
    );
    response.status(200).json(updatedVideo);
  } catch (error) {
    next(error);
  }
};
// delete video
export const deleteVideo = async (request, response, next) => {
  try {

    const video = await Video.findById(request.params.id);
    if (!video) return response.status(404).json("Video not found!");
    if (!request.user.id === video.userId) return response.status(403).json("You can delete only your video!");

    await Video.findByIdAndDelete(request.params.id);
    response.status(200).json("video has been deleted");
  } catch (error) {
    next(error);
  }
};
// get video
export const getVideo = async (request, response, next) => {
  try {
  const video = await Video.findById(request.params.id);
  response.status(200).json(video);
  } catch (error) {
    next(error);
  }
};
// add view
export const addViewToVideo = async (request, response, next) => {
  try {
    await Video.findByIdAndUpdate(request.params.id, { $inc: { views: 1 } });
    response.status(200).json("view count has been increased");
  } catch (error) {
    next(error);
  }
};
// get random videos
export const getRandomVideo = async (request, response, next) => {
  
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    response.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// get videos by user
export const getVideosByUser = async (request, response, next) => {
  try {
    const videos = await Video.find({userId: request.params.id});
    response.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};


// get trending videos
export const getTrendingVideo = async (request, response, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    response.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
// get videos from users subscribed to
export const getSubcriptionVideos = async (request, response, next) => {
  try {
    const user = await User.findById(request.user.id);

    const list = await Promise.all(
      user.subscriptions.map(async (userId) => await Video.find({userId}))
    );

    response
      .status(200)
      .json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
};
// get by tag
export const getVideoByTag = async (request, response, next) => {
  const tags = request.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    response.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
// search for video
export const getVideoBySearch = async (request, response, next) => {
  const query = request.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    response.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
