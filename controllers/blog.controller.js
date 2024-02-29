import { generateResponse, asyncHandler } from '../utils/helpers.js';
import { STATUS_CODES } from '../utils/constants.js';
import { createBlog,deleteBlog,getBlogs,updateBlog, findBlog} from '../models/index.js';

// Create blog
export const createBlogPost = asyncHandler(async (req, res,next) => {

    const blog = await createBlog(req.body);
    generateResponse(blog, "Blog created sucessfully", res);

});

// fetch all the blogs
export const fetchBlogs = asyncHandler(async (req, res,next) => {

    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const blogs = await getBlogs({ query: {}, page, limit});

    generateResponse(blogs,"Blogs Fetch sucessfully", res);
});

// delete blog 
export const deleteBlogPost = asyncHandler(async (req, res) => {

    const id = req.params.id 

    if(!id) return next({
        message: 'Blog not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })

    const blog = await deleteBlog(req.params.id);

    generateResponse(blog, "Blog deleted sucessfully",res);
});

// update blog 
export const updateBlogPost = asyncHandler(async (req, res,next) => {

    const id = req.params.id

    if(!id) return next({
        message: 'Blog not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })

    const blog = await updateBlog(id, req.body);

     generateResponse(blog, "Blog Updated sucessfully",res);
});

// Get single Blog
export const getBlog = asyncHandler(async (req, res,next) => {

    const blog = await findBlog({ _id: req.params.id });

    if(!blog) return next({
        message: 'Blog not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })
    
     generateResponse(blog, "Blog Fetch sucessfully",res);
});
