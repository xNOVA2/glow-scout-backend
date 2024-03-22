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
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Date 7 days ago
                $lt: new Date(), // Current date and time
            },
        },
    },
    {
        $group: {
            _id: null,
            todayCount: { $sum: { $cond: [{ $gte: ["$visitDate", new Date(new Date().setHours(0, 0, 0, 0))] }, 1, 0] } },
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
                            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Date 14 days ago
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
    {
        $project: {
            todayCount: 1,
            lastWeekVisits: { $arrayElemAt: ["$lastWeekVisits", 0] },
        },
    },
]);



