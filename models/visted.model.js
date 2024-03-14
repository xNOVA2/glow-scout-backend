import mongoose from 'mongoose'

const visitedSpaSchema = new mongoose.Schema({
    spa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
  });
  
  const VisitedSpa = mongoose.model('VisitedSpa', visitedSpaSchema);


  export const addVisitedSpa =  (obj) => VisitedSpa.create(obj);

  export const getAllVisitedSpa = (id) => VisitedSpa.aggregate([
    {
      $match: {
        spa: new mongoose.Types.ObjectId(id),
        visitDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)), 
          $lt: new Date(new Date().setHours(23, 59, 59, 999)), 
        },
      },
    },
    {
      $group: {
        _id: null,
        todayCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        todayCount: 1,
      },
    },
    {
      $lookup: {
        from: 'visitedspas',
        let: { spaId: '$_id' },
        pipeline: [
          {
            $match: {
              spa: new mongoose.Types.ObjectId(id),
              visitDate: {
                $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999)),
              },
            },
          },
          {
            $group: {
              _id: null,
              lastWeekCount: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              lastWeekCount: 1,
            },
          },
        ],
        as: 'lastWeekVisits',
      },
    },
  ]);
  