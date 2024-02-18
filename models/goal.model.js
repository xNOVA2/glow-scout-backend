import { Schema, model } from "mongoose";
import { getMongoosePaginatedData } from '../utils/helpers.js';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const goalSchema = new Schema({
    title: {type: String},
    image: {type: String},
    isDeleted:{type:Boolean,default:false}
}, { timestamps: true, versionKey: false });


goalSchema.plugin(mongoosePaginate);
goalSchema.plugin(aggregatePaginate);


 const GoalModel = model("goal", goalSchema);
 
 // create 
 export const createGoal = (goalData) => GoalModel.create(goalData);

 // update
 export const updateGoal = (id, updatedData) => GoalModel.findByIdAndUpdate(id, updatedData, {new: true,});
 
 // delete 
 export const deleteGoalById = (id) => GoalModel.findByIdAndDelete(id);
 
 // get all goals
 export const getAllGoals = async ({ query, page, limit }) => {
    const { data, pagination } = await getMongoosePaginatedData({
        model: GoalModel,
        query:   {...query,isDeleted:false},
        page,
        limit,

    });
    return { data, pagination };
};

 // find goal by id
 export const findGoal = (query) => GoalModel.findOne(query);
