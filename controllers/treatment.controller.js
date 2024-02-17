import { generateResponse, asyncHandler } from '../utils/helpers.js';
import { STATUS_CODES } from '../utils/constants.js';
import {
    createTreatment,
    deleteTreatmentById,
    findTreatment,
    getAllTreatment,
    getAllTreatmentOfSingleGoal,
    getAllTreatmentsByTitleAndUser,
    updateTreatmentById

} from '../models/index.js';

// Add Treatment API
export const addTreatment = asyncHandler(async (req, res, next) => {

   
    const treatment = await createTreatment(req.body);
    generateResponse(treatment, 'Treatment created successfully', res);
});
// Assign Treatment To Spa API
export const assignTreatmentToSpa = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const spaId = req.user.id;

    const treatment = await findTreatment({ _id: id });
    console.log(treatment);
    if (!treatment) return next({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: 'Treatment not found'
    })

    const updateTreatment =  await updateTreatmentById(id, { $addToSet: { spas: spaId } });    

    generateResponse(updateTreatment, 'Treatment assigned to spa successfully', res);

})

export const getAllTreatmentsOfSingleGoals = asyncHandler(async (req, res, next) => {

    const goalId = req.params.id;
    if (!goalId) {
        return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: 'Goal id is required'
        })
    }

    const treatments = await getAllTreatmentOfSingleGoal(goalId);
    generateResponse(treatments, 'Treatments fetched successfully', res);

})

// Fetch all Treatments 
export const fetchTreatments = asyncHandler(async (req, res, next) => {

    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);

    const treatments = await getAllTreatment({query:{},page,limit});
    console.log(treatments);
    generateResponse(treatments, 'Treatments fetched successfully', res);
});

// Update Treatments API
export const updateTreatment = asyncHandler(async (req, res, next) => {
 
    const id = req.params.id;

    if (!id) {
        return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: 'Treatment id is required'
        })
    }

    const treatment = await updateTreatmentById(id, req.body);

    if (!treatment) {
        return next({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: 'Treatment not found'
        })
    }

     generateResponse(treatment, 'Treatment updated successfully', res);
})

// Delete Treatments API
export const deleteTreatment = asyncHandler(async (req, res, next) => {
    const user = req.user;

    const id = req.params.id;

    if (user.role !== 'business') {
        return next({
            statusCode: STATUS_CODES.UNAUTHORIZED,
            message: 'You are not authorized to perform this action'
        })
    }

    if (!id) {
        return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: 'Treatment id is required'
        })
    }

    const treatment = await deleteTreatmentById(id);

    if (!treatment) {
        return next({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: 'Treatment not found'
        })
    }

    return generateResponse(treatment, 'Treatment deleted successfully', res);
})


export const getAllTreatmentsByTitleAndUsers = asyncHandler(async (req, res, next) => {
    const { title } = req.query;

    if (!title) {
        return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: 'Title is required'
        })
    }



    const treatments = await getAllTreatmentsByTitleAndUser(title);

    return generateResponse(treatments, 'Treatments fetched successfully', res);
})