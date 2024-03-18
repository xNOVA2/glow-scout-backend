import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { getMongoosePaginatedData } from '../utils/helpers.js';

const blogSchema = new mongoose.Schema({
    coverPicture:{
        type: String,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    isFeatured: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

blogSchema.plugin(mongoosePaginate);
blogSchema.plugin(aggregatePaginate);

const BlogModel = mongoose.model('Blog', blogSchema);

export const createBlog = (blog) => BlogModel.create(blog);

export const getBlogs = async ({ query, page, limit }) => {
    const { data, pagination } = await getMongoosePaginatedData({
        model: BlogModel,
        query:   {...query},
        page,
        limit,

    });
    return { data, pagination };
};

export const findBlog = (query) => BlogModel.findOne(query)

export const updateBlog = (id, update) => BlogModel.findByIdAndUpdate(id, update)

export const deleteBlog = (id) => BlogModel.findByIdAndDelete(id)