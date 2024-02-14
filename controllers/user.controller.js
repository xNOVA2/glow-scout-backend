import { findUser, getAllUsers } from "../models/index.js";
import { ROLES } from "../utils/constants.js";
import { asyncHandler, generateResponse } from '../utils/helpers.js';

// get all users
export const fetchAllUsers = asyncHandler(async (req, res, next) => {
    console.log('>>>first')
    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);

    // const filters = [{ role: { $ne: ROLES.ADMIN } }];
    // if (req.query.role) filters.push({ role: req.query.role });
    // const query = { $and: filters };

    const usersData = await getAllUsers({ query: {}, page, limit });
    if (usersData?.data?.length === 0) {
        generateResponse(null, 'No user found', res);
        return;
    }

    generateResponse(usersData, 'List fetched successfully', res);
});

// get current user
export const getUser = asyncHandler(async (req, res, next) => {
    const user = await findUser({ _id: req.params.userId });
    generateResponse(user, 'User fetched successfully', res);
});

// assign senior to user
export const assignSenior = asyncHandler(async (req, res, next) => {
    const user = await findUser({ _id: req.body.user });
    user.senior = req.body.senior;

    await user.save();
    generateResponse(user, 'Senior assigned successfully', res);
});

// get unassigned users
export const getUnassignedUsers = asyncHandler(async (req, res, next) => {
    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const query = {
        $and: [
            { senior: null },
            { role: { $ne: ROLES.ADMIN } },             // exclude admin
            { role: { $ne: ROLES.GCC_DIRECTOR } }       // exclude gcc director (top level)
        ]
    };

    if (req.query.role) query.role = req.query.role;

    const users = await getAllUsers({ query, page, limit });
    if (users?.data?.length === 0) {
        generateResponse(null, 'No user found', res);
        return;
    }

    generateResponse(users, 'List fetched successfully', res);
});

// get my subordinates
export const getListOfSubordinates = asyncHandler(async (req, res, next) => {
    const user = req.query?.user || req.user.id;

    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const query = { senior: user };

    const users = await getAllUsers({ query, page, limit });
    if (users?.data?.length === 0) {
        generateResponse(null, 'No user found', res);
        return;
    }

    generateResponse(users, 'List fetched successfully', res);
});