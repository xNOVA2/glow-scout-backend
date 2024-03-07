import { generateResponse, asyncHandler } from '../utils/helpers.js';
import { STATUS_CODES } from '../utils/constants.js';
import { bookTreatment ,fetchBooksTreatments} from '../models/index.js';

export const createBookTreatment =  asyncHandler(async (req, res, next) => {
    const book = await bookTreatment(req.body);
    generateResponse(book, "Book created successfully", res);
});

export const fetchBookTreatments = asyncHandler(async (req, res, next) => {
    const books = await fetchBooksTreatments();
    generateResponse(books, "Books fetched successfully", res);
});
