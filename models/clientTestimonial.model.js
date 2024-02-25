import mongoose from 'mongoose'

const clientTestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  testimonial: {
    type: String,
  },
  rating: {
    type: Number,
  },
  image: {
    type: String,
  },  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ClientTestimonial = mongoose.model('ClientTestimonial', clientTestimonialSchema);

export const createTestimonial = (obj) => ClientTestimonial.create(obj);

export const fetchTestimonials = (obj) => ClientTestimonial.find(obj);

export const updateTestimonial = (id, data) => ClientTestimonial.findByIdAndUpdate(id, data, {new:true});

export const deleteTestimonial = (id) => ClientTestimonial.findByIdAndDelete(id);

export const getTestimonial = (query) => ClientTestimonial.findOne(query)