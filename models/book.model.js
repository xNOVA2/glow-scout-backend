import mongoose from 'mongoose';

const treatmentBookSchema = new mongoose.Schema({
   firstName:{
        type: String,
    },
    lastName:{
        type: String,
    },
    email:{
        type: String,
    },
    alternateEmail:{
        type:String
    },
    address:{
        type: String,
    },
    phone:{
        type: String,
   },
    spa:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    treatment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'treatment',
    },
    date:{
        type: Date,
    },
    time:{
        type: String,
    },
    comment:{
        type: String,
    },
    
});

const TreatmentBook = mongoose.model('TreatmentBook', treatmentBookSchema);

export const bookTreatment = (obj) => TreatmentBook.create(obj);
export const fetchBooksTreatments = () => TreatmentBook.find()

