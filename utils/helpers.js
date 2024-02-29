import { createUser, findUser } from '../models/index.js';
import { ROLES } from './constants.js';
import fs from 'fs'
import multer from 'multer';

// generate response with status code
export const generateResponse = (data, message, res, code = 200) => {
    return res.status(code).json({
        statusCode: code,
        message,
        data,
    });
}

// parse body to object or json (if body is string)
export const parseBody = (body) => {
    let obj;
    if (typeof body === "object") obj = body;
    else obj = JSON.parse(body);
    return obj;
}

// pagination with mongoose paginate library
export const getMongoosePaginatedData = async ({
    model, page = 1, limit = 10, query = {}, populate = '', select = '-password', sort = { createdAt: -1 },
}) => {
    const options = {
        select,
        sort,
        populate,
        lean: true,
        page,
        limit,
        customLabels: {
            totalDocs: 'totalItems',
            docs: 'data',
            limit: 'perPage',
            page: 'currentPage',
            meta: 'pagination',
        },
    };

    const { data, pagination } = await model.paginate(query, options);
    delete pagination?.pagingCounter;

    return { data, pagination };
}

// aggregate pagination with mongoose paginate library
export const getMongooseAggregatePaginatedData = async ({ model, page = 1, limit = 10, query = [] }) => {
    const options = {
        page,
        limit,
        customLabels: {
            totalDocs: 'totalItems',
            docs: 'data',
            limit: 'perPage',
            page: 'currentPage',
            meta: 'pagination',
        },
    };

    const myAggregate = model.aggregate(query);
    const { data, pagination } = await model.aggregatePaginate(myAggregate, options);

    delete pagination?.pagingCounter;

    return { data, pagination };
}

export const asyncHandler = (requestHandler) => {
    return (req, res, next) => Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
};

// create default admin
export const createDefaultAdmin = async () => {
    const userExist = await findUser({ email: process.env.ADMIN_DEFAULT_EMAIL, role: ROLES.ADMIN });
    if (userExist) {
        console.log('admin exists -> ', userExist.email);
        return
    };

    console.log('admin not exist');
    // const password = await hash(process.env.ADMIN_DEFAULT_PASSWORD, 10);

    // create default admin
    await createUser({
        email: process.env.ADMIN_DEFAULT_EMAIL,
        password: process.env.ADMIN_DEFAULT_PASSWORD,
        name: 'Admin',
        role: ROLES.ADMIN
    });

    console.log('Admin default created successfully');
};
export const generateRandomOTP = () => {
    return Math.floor(10000 + Math.random() * 90000);
}

const generateFilename = (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.' + file.originalname.split('.').pop());
}

const filterImageOrDocsOrPDF = (req, file, cb) => {
    if (!file.mimetype.match(/image\/(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF|svg|SVG|bmp|BMP|ico|ICO|tiff|TIFF|psd|PSD|pdf|PDF|doc|DOC|docx|DOCX|xls|XLS|xlsx|XLSX|ppt|PPT|pptx|PPTX)/)) {
        req.fileValidationError = 'Only image, docs and pdf files are allowed!';
        return cb(null, false);
    }
    cb(null, true);
}

export const upload = (folderName) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                const path = `/tmp/${folderName}/`;
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path, { recursive: true });
                }
                cb(null, path);
            },

            // By default, multer removes file extensions so let's add them back
            filename: generateFilename
        }),
        limits: { fileSize: 10 * 1024 * 1024 },  // max 10MB //
        fileFilter: filterImageOrDocsOrPDF
    })
}


export const getCities = async () =>{
    const response = await fetch('http://storytime.yameenyousuf.com/api/states?countryCode=US');
    
    const cities = await response.json();
    
    return cities
}