import { generateResponse, asyncHandler } from "../utils/helpers.js";
import { STATUS_CODES } from "../utils/constants.js";
import {
  createTestimonial,
  fetchTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../models/index.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const CreateTestimonial = asyncHandler(async (req, res, next) => {
  
    if (!req.files?.image || req.files?.image.length === 0)
    return next({
      statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
      message: "Image is required",
    });

  const picture = await uploadOnCloudinary(req.files.image[0].path);
    req.body.image = picture.secure_url;
  const testimonial = await createTestimonial(req.body);

  generateResponse(testimonial, "Testimonial created successfully", res);
});

export const deleteTestimonials = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const testimonial = await deleteTestimonial(id);
  generateResponse(testimonial, "Testimonial deleted successfully", res);
});

export const fetchAllTestimonials = asyncHandler(async (req, res, next) => {
  const testimonials = await fetchTestimonials();
  generateResponse(testimonials, "Testimonials fetched successfully", res);
});

export const updateTestimonials = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (req.files?.image?.length > 0){
       
       req.body.image = await uploadOnCloudinary(req.files?.image[0].path);
  }
    
  const testimonial = await updateTestimonial(id, {...req.body,image:req.body.image?.secure_url});

  generateResponse(testimonial, "Testimonial updated successfully", res);
});
