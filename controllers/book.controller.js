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
    const admin = await findUser({role:"admin"})
    
    await Mailer.sendEmail({
        email: admin.email,
        subject: "Booking Confirmation",
        message: `The  spa has been booked for a Treatment at ${req.body.date} on ${req.body.time}
        <hr/>
        ${spa.name}
        ${spa.email}
        
        `
    });

    const book = await bookTreatment(req.body);
    
    generateResponse(book, "Book created successfully", res);
});

export const fetchBookTreatments = asyncHandler(async (req, res, next) => {
    const books = await fetchBooksTreatments();
    generateResponse(books, "Books fetched successfully", res);
});
