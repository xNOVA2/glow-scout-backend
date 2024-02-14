import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { getMongoosePaginatedData } from "../utils/helpers.js";
import { ROLES } from "../utils/constants.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// user schema
const userSchema = new Schema({
    name: { type: String },
    email: { type: String, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, enum: Object.values(ROLES), default: "user" },
    profileImage: { type: String },
    isDeleted: { type: Boolean, default: false},
    otp:{type: Number},
    otpExpiry:{type:Date},
}, { timestamps: true, versionKey: false });

// hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// compare password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role,
            name:this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
};

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

const UserModel = model('user', userSchema);

// create new user
export const createUser = (obj) => UserModel.create(obj);

// find user by query
export const findUser = (query) => UserModel.findOne({...query,isDeleted:false});

// get all users
export const getAllUsers = async ({ query, page, limit }) => {
    const { data, pagination } = await getMongoosePaginatedData({
        model: UserModel,
        query:   {...query,isDeleted:false},
        page,
        limit,

    });

    return { data, pagination };
};

export const deleteUserById = (id) => UserModel.findByIdAndDelete(id)