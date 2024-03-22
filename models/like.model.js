import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  spa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  liked:{
    type:Boolean,
    default:false
  
  }
});

const Like = mongoose.model("like", likeSchema);

export const createLike = (obj) => Like.create(obj);

export const getLikeCount = (id) =>
Like.aggregate([
    {
      $match: {
        spa: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ]);


  export const findLike = (query) => Like.findOne(query)