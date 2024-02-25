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
    image: {
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

export const deleteTreatment = (id) => TreatmentModel.findByIdAndDelete(id)

// get all treatment
export const getAllTreatments = async ({ query, page, limit,sort }) => {
    const { data, pagination } = await getMongoosePaginatedData({
        model: TreatmentModel,
        query:   {...query},
        page,
        limit,
        sort
    });
    return { data, pagination };
};

export const getAllTreatment = async (id) => {
    const treatment = await TreatmentModel.findOne({_id:id}).populate('spas');
    return treatment;
 };
 export const findTreatment =  (query) =>  TreatmentModel.findOne(query);

export const findAllSpasTreatment =  (id) =>  TreatmentModel.aggregate([
    {
        $match: {
            spas: new  mongoose.Types.ObjectId(id)
        }
    }
])


