import { generateResponse, asyncHandler } from '../utils/helpers.js';
import { ROLES, STATUS_CODES } from '../utils/constants.js';
import { findAllSpasTreatment } from '../models/treatment.model.js';
import { findUser, getAllUsers, updateUser } from '../models/index.js';

export const findSpasTreatment = asyncHandler(async (req, res, next) => {

    const id = req.params.id

    if(!id) return next({
        message: 'Id not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })

    const spas = await findAllSpasTreatment(id);

    generateResponse(spas, "Spas Treatment fetched successfully", res);
})

export const fetchSpas = asyncHandler(async (req, res, next) => {

    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const search = req.query.search || '';
    const filter = req.query.filter || '';
    let sortDirection = 1; // Default is ascending order (A to Z)

    if (filter.toLowerCase() === 'ztoa') {
        sortDirection = -1; // Set to -1 for descending order (Z to A)
    }

    const  spas = await getAllUsers((
        { 
            query: { name: { $regex: `^${search}`, $options: 'i' } },
            page, 
            limit,   
            sort: { name: sortDirection }, // Sort by title in specified direction
            role:'business'
        }
    ));

    generateResponse(spas , "Spas fetched successfully", res);
})

    export const UpdateSpas = asyncHandler(async (req, res, next) => {
        
            const id = req.user.id
            
            if(!id) return next({
                message: 'Id not found',
                statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY
            })

            if(!req.files?.profileImage || req.files?.profileImage.length===0) return next({
                statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
                message: "profile Image is required",
              });

            req.body.profileImage = req.files.profileImage[0].path;
            
            const data  = req.body;
            
            const spa = await updateUser(id,data);
            
            generateResponse(spa, "Spa updated successfully", res);            
    })

        export const GetSpa = asyncHandler(async (req, res, next) => {
                
                    const id = req.params.id;
                    
                    if(!id) return next({
                        message: 'Id not found',
                        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY
                    })
                
                    const spa = await findUser({_id:id});

                    if(!spa) return next({
                        message: 'Spa not found',
                        statusCode: STATUS_CODES.NOT_FOUND
                    })

                    generateResponse(spa, "Spa fetched successfully", res);
        })

