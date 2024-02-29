import { generateResponse, asyncHandler, generateRandomOTP } from '../utils/helpers.js';
import { createUser, findUser } from '../models/index.js';
import { STATUS_CODES } from '../utils/constants.js';

// Register user API
export const register = asyncHandler(async (req, res, next) => {
    // create user in db
    let user = await createUser(req.body);
    // remove password
    user = user.toObject();
    delete user.password;

    generateResponse( user , "Register successful", res);
});

// Login user API
export const login = asyncHandler(async (req, res, next) => {
    
    let user = await findUser({ email: req.body.email }).select('+password');

    if (!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid email or password'
    });

    const isMatch = await user.isPasswordCorrect(req.body.password);
    if (!isMatch) return next({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: 'Invalid password'
    });

    const accessToken = await user.generateAccessToken();
    req.session = { accessToken };

    // remove password
    user = user.toObject();
    delete user.password;

    res.cookie({session:accessToken})
    generateResponse({ user, accessToken }, 'Login successful', res);
});

// OTP Generate API
export const otpGenerate = asyncHandler(async (req, res, next) => {
    // create user in db
  let {email} = req.body;

  const otp = generateRandomOTP()
 
    // remove password
    const otpExpiry = new Date();
    
    otpExpiry.setMinutes(otpExpiry.getMinutes() + parseInt(process.env.OTP_EXPIRATION));

    const user = await findUser({ email });
    console.log("Test")
    console.log(user);
    if (!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'user does not exist'
    });

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    console.log("User Saved",user);
    await user.save();
    
    generateResponse( otp , "OTP generated sucessfully", res);
})

// OTP VERIFY API
export const otpVerify = asyncHandler(async (req, res, next) => {
    // create user in db
    let {email, otp} = req.body;

    const user = await findUser({ email });
    
    if(!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'user is not authorized to perform this action again.'
    });

    if(user.otp != otp) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid OTP'
    });

    if(user.otpExpiry < new Date()) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'OTP expired'
    });

    user.otp = null;
    user.otpExpiry = null;

    await user.save();
    
    const acessToken = await user.generateAccessToken(user);

    generateResponse( acessToken , "OTP verified sucessfully", res);
})

// Reset password  API
export const resetPassword = asyncHandler(async (req, res, next) => {
    // create user in db
  let {password} = req.body;
    
    const user = await findUser({ email:req.user.email, });

    if(!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid email'
    });
    
    user.password = password;

    await user.save();
    
    generateResponse( null , "Password reset sucessfully", res);
})

//  Current user API
export const getCurrentUser = asyncHandler(async(req,res,next)=>{
     
    let user = await findUser({ _id: req.user.id });
    console.log(req.session.accessToken);

    // remove password
    user = user.toObject();
    delete user.password;

    generateResponse(user, "User fetched sucessfully", res);
})

// Logout API
export const logoutUser = asyncHandler(async(req,res,next)=>{
    req.session = null;
    generateResponse(null, "User logged out sucessfully", res);
})


export const googleAuthHandler = asyncHandler(async (req, res, next) => {
    // Successful authentication, redirect home.
    
    const {email,name,sub } = req.user._json

    const existUser = await findUser({ email:email });

    if(!existUser){
    // this block will run when user doesnot exist 
        
        // create a user 
        const createdUser = await createUser({email:email,name:name,password:sub,role:"user",loginType:'GOOGLE'});

        let user = createdUser.toObject();

        delete user.password;

        const accessToken = await createdUser.generateAccessToken();

        req.session = { accessToken };

        generateResponse({ user, accessToken }, 'Login successful', res);

    }

    if(existUser.loginType !== 'GOOGLE'){
        return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: `Please login with the ${findUser.loginType} as you previously login with that`
        });
    }

    const accessToken = existUser.generateAccessToken();

    req.session = {accessToken};
    console.log(req.session.accessToken);
    
  res.redirect('/')
})