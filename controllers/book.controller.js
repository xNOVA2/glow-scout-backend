import { generateResponse, asyncHandler } from '../utils/helpers.js';
import { STATUS_CODES } from '../utils/constants.js';
import { bookTreatment ,fetchBooksTreatments, findUser} from '../models/index.js';
import Mailer from '../utils/email.js';

export const createBookTreatment =  asyncHandler(async (req, res, next) => {

    
    const spa = await findUser({_id:req.body.spa});

    if (!spa) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'spa does not exist'
    });

    await Mailer.sendEmail({
        email: spa.email,
        subject: "Booking Confirmation",
        message: `Your spa has been booked for ${req.body.treatment} at ${req.body.date} on ${req.body.time} with ${req.body.spa}. `
    });

    const book = await bookTreatment(req.body);
    
    generateResponse(book, "Book created successfully", res);
});

export const fetchBookTreatments = asyncHandler(async (req, res, next) => {
    const books = await fetchBooksTreatments();
    generateResponse(books, "Books fetched successfully", res);
});
