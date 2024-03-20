import mongoose from "mongoose";
import { getMongoosePaginatedData } from "../utils/helpers.js";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const treatmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    spas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    price: {
      type: String,
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "goal",
    },
    isFeatured:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true, versionKey: false }
);

treatmentSchema.plugin(mongoosePaginate);
treatmentSchema.plugin(aggregatePaginate);

const TreatmentModel = mongoose.model("treatment", treatmentSchema);

export const createTreatment = (treatmentData) =>
  TreatmentModel.create(treatmentData);

export const getAllTreatmentOfSingleGoal = async ({
  query,
  page,
  limit,
  sort,
  id,
}) => {
  const { data, pagination } = await getMongoosePaginatedData({
    model: TreatmentModel,
    query: { ...query, goal: id },
    page,
    limit,
    sort,
  });
  return { data, pagination };
};
export const updateTreatmentById = (id, obj) =>
  TreatmentModel.findByIdAndUpdate(id, obj, { new: true });

export const deleteTreatment = (id) => TreatmentModel.findByIdAndDelete(id);

// get all treatment
export const getAllTreatments = async ({ query, page, limit, sort }) => {
  const { data, pagination } = await getMongoosePaginatedData({
    model: TreatmentModel,
    query: { ...query },
    page,
    limit,
    sort,
  });
  return { data, pagination };
};

export const getAllTreatment = (id) =>
  TreatmentModel.findOne({ _id: id }).populate("spas");

export const findTreatment = (query) => TreatmentModel.findOne(query);

export const findAllSpasTreatment = (id) =>
  TreatmentModel.aggregate([
    { $match: { spas: new mongoose.Types.ObjectId(id) } },
  ]);


  export const treatmentCount = (id) =>
  TreatmentModel.aggregate([
    {
      $match: {
        spas: {
          $in: [new mongoose.Types.ObjectId(id)],
        },
      },
    },
    {
      $group: {
        _id: null,
        ServicesOffer: { $sum: 1 },
        titles: { $push: "$title" },
      },
    },
  ]);

export const fetchFeatureTreatment = () =>TreatmentModel.aggregate([
  {
    $match: {
      isFeatured:true
    }
  }
]);