import { generateResponse, asyncHandler } from '../utils/helpers.js';
import { STATUS_CODES } from '../utils/constants.js';
import { createSetting,getSetting} from '../models/index.js';

export const createSettingPost = asyncHandler(async (req, res) => {
    
    const setting = await createSetting(req.body);
    generateResponse(setting, "Update sucessfully", res);

});

export const Fetchsetting = asyncHandler(async (req, res,next) => {
    const type = req.query.type;

    if(!type) return next ({
        message: 'Setting not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })

    const settings = await getSetting(type);
    generateResponse(settings,"Setting Fetch sucessfully", res);
}); 