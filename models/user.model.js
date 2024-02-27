import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { getMongoosePaginatedData } from "../utils/helpers.js";
import { ROLES } from "../utils/constants.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// social links schema
const socialLinks = new Schema({
    platform: { type: String, enum: ['facebook', 'instagram', 'snapchat'] },
    url: { type: String }
}, { _id: false });

// business timing schema
const businessTiming = new Schema({
    Monday: {
        ON: { type: Boolean, default: false },
        startTime: { type: String, default: "09:00 AM" },
        endTime: { type: String, default: "06:00 PM" },
    },
    Tuesday: {
        ON: { type: Boolean, default: false },
        startTime: { type: String, default: "09:00 AM" },
        endTime: { type: String, default: "06:00 PM" },
    },
    Wednesday: {
        ON: { type: Boolean, default: false },
        startTime: { type: String, default: "09:00 AM" },
        endTime: { type: String, default: "06:00 PM" },
    },
    Thursday: {
        ON: { type: Boolean, default: false },
        startTime: { type: String, default: "09:00 AM" },
        endTime: { type: String, default: "06:00 PM" },
    },
    Friday: {
        ON: { type: Boolean, default: false },
        startTime: { type: String, default: "09:00 AM" },
        endTime: { type: String, default: "06:00 PM" },
    },
    Saturday: {
        ON: { type: Boolean, default: false },
        startTime: { type: String, default: "09:00 AM" },
        endTime: { type: String, default: "06:00 PM" },
    },
    Sunday: {
        ON: { type: Boolean, default: false },
        startTime: { type: String, default: "09:00 AM" },
        endTime: { type: String, default: "06:00 PM" },
    },
}, { _id: false });

// user schema
const userSchema = new Schema({
    name: { type: String },
    email: { type: String, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, enum: Object.values(ROLES), default: "user" },
    profileImage: { type: String },
    isDeleted: { type: Boolean, default: false },
    otp: { type: Number, select: false },
    otpExpiry: { type: Date, select: false },
    alternateEmail: { type: String },
    businessEmail: { type: String },
    phone: { type: String },
    links: { type: [socialLinks], default: [] },
    city: { type: String },
    businessTiming: businessTiming,
    showcaseImages: { type: [String], default: [] },
}, { timestamps: true });

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
            name: this.name
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

// update user
export const updateUser = (id, data) => UserModel.findByIdAndUpdate(id, data, { new: true });
// find user by query
export const findUser = (query) => UserModel.findOne({ ...query, isDeleted: false });

// get all users
export const getAllUsers = async ({ query, page, limit }) => {
    const { data, pagination } = await getMongoosePaginatedData({
        model: UserModel,
        query: { ...query, isDeleted: false },
        page,
        limit,

    });

    return { data, pagination };
};

// delete user we will change this to soft delete
export const deleteUserById = (id) => UserModel.findByIdAndDelete(id)

// Spas Methods

export const getAllSpas = async ({ query, page, limit }) => {
    const { data, pagination } = await getMongoosePaginatedData({
        model: UserModel,
        query: { ...query, role: ROLES.BUSINESS },
        page,
        limit,
    });

    return { data, pagination };
}

