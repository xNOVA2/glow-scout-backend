import mongoose from 'mongoose'

const landingPageSchema = new mongoose.Schema({
    heading1: {
        type: String,
    },
    heading2: {
        type: String,
    },
    text: {
        type: String,
    },
    aboutUs: {
        type: String,
    },
    buttonText:{
        type: String,
    },
    buttonLink:{
        type: String,
    },
    picture:{
        type:String
    }
}, { timestamps: true,versionKey:false });

const LandingPage = mongoose.model('LandingPage', landingPageSchema);

export const fetchLandingPage =  () => LandingPage.find();

export const createLandingPage =  (obj) =>  LandingPage.updateOne({}, obj, { upsert: true });
