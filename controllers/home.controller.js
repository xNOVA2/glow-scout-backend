import { createLandingPage, fetchLandingPage } from "../models/index.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { asyncHandler, generateResponse } from "../utils/helpers.js";

export const fetchHomePage = asyncHandler(async (req, res, next) => {
    const landingPage = await fetchLandingPage();
    generateResponse(landingPage, "Landing Page fetched successfully", res);
    });

    export const createHomePages = asyncHandler(async (req, res, next) => {
        if (req.files?.picture?.length > 0) {
            const image = await uploadOnCloudinary(req.files.picture[0].path);
            req.body.picture = image.secure_url;
        }
        console.log(req.body.picture);
        const landingPage = await createLandingPage(req.body);
        generateResponse(landingPage, "Landing Page created successfully", res);
    });
    