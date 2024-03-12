import mongoose from 'mongoose'

// Define the review schema
const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
    },
    description: {
        type: String,
    },
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
});

// Create the review model
const Review = mongoose.model('Review', reviewSchema);

export const createReview = (obj) => Review.create(obj)
export const fetchReview = (query) => Review.find(query).populate('from')
