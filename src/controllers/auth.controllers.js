import userModel from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { mailVerificationMelgenContent, sendMail } from "../utils/mail.js";

const registerUser = asyncHandler(async (req, res, next) => {

    const { email, username, password, role } = req.body;

    const existingUser = await userModel.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new ApiError(409, "User already exist.");
    }

    const newUser = await userModel.create({
        email,
        username,
        password,
        isEmailVerified: false
    });

    const tokens = await newUser.generateTemporaryToken();

    newUser.emailVerificationToken = tokens.hashedToken;
    newUser.emailVerificationExpiry = tokens.tokenExpiry;

    await newUser.save();

    const emailVerifyUrl = `${process.env.FRONTEND_URL}/api/v1/users/verify-email?token=${tokens.unHashedToken}&id=${newUser._id}`;

    const emailTemplate = mailVerificationMelgenContent(username, emailVerifyUrl);

    await sendMail({
        email: newUser?.email,
        subject: "Email Verification",
        mailgenContent: emailTemplate
    });

     const createdUser =await userModel.findById(newUser._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the new user.");
    }

    console.log("Created user data :",createdUser);
    return res.status(201).json(
        new ApiResponse(201,
            { userData: createdUser}, "User Register Successfully."
        )
    );

}
);

const verifyEmail = asyncHandler(async (req, res, next) => {

});

export {
    registerUser,
    verifyEmail
}