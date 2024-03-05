import mongoose from mongoose
// Import the required modules

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
    }
});

// Create the review model
const Review = mongoose.model('Review', reviewSchema);
