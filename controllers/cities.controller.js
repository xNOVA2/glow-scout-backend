import { generateResponse, asyncHandler, getCities } from '../utils/helpers.js';
import { STATUS_CODES } from '../utils/constants.js';

export const fetchCities = asyncHandler(async (req, res) => {
    
    const cities = await getCities();

    generateResponse(cities, "Cities fetched successfully", res);

})