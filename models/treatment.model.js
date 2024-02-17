import  mongoose from 'mongoose';
import { getMongoosePaginatedData } from '../utils/helpers.js';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const treatmentSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    picture: {
        type: String,
    },
    spas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'goal',
    }
  
}, {timestamps: true,versionKey: false,});

treatmentSchema.plugin(mongoosePaginate);
treatmentSchema.plugin(aggregatePaginate);


const TreatmentModel = mongoose.model('treatment', treatmentSchema);

export const createTreatment = (treatmentData) => TreatmentModel.create(treatmentData)

export const getAllTreatmentOfSingleGoal = (id) => TreatmentModel.find({goal: id}); 

export const updateTreatmentById = (id, obj) => TreatmentModel.findByIdAndUpdate(id, obj, {new: true,});

export const deleteTreatmentById = (id) => TreatmentModel.findByIdAndDelete(id)

// get all treatment
export const getAllTreatment = async ({ query, page, limit }) => {
    const { data, pagination } = await getMongoosePaginatedData({
        model: TreatmentModel,
        query:   {...query},
        page,
        limit,
    });
    return { data, pagination };
};

export const getAllTreatmentsByTitleAndUser = (title) => { return TreatmentModel.aggregate([{ $match: { title: title }},{$lookup: {from: 'users',  localField: 'createdByUser',foreignField: '_id',as: 'createdByUser'}},{$unwind: '$createdByUser'},])}

export const findTreatment = (query) => TreatmentModel.findOne(query);