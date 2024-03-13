import mongoose from 'mongoose'

const visitedSpaSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    spa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
  });
  
  const VisitedSpa = mongoose.model('VisitedSpa', visitedSpaSchema);
  