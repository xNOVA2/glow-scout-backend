import mongoose from 'mongoose';

const treatmentCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image:{
    type:String,
  },
  treatments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'treatment',
}],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TreatmentCategory = mongoose.model('TreatmentCategory', treatmentCategorySchema);

export const createTreatementCategory = (obj) => TreatmentCategory.create(obj);

export const findTreatementCategory = (query) => TreatmentCategory.findOne(query);

export const findTreatementCategories = (query) => TreatmentCategory.find(query);

export const updateTreatementCategory = (query, update) => TreatmentCategory.findOneAndUpdate(query, update,{new:true})

