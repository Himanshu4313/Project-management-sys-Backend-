import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const userSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localPath: String,
        },
        default: {
            url: `https://placehold.co/200x200`,
            localPath: ""
        }
    },

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    fullName: {
        type: String,
        trim: true,
        required: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    refreshToken: {
        type: String
    },

    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type: Date
    },

    emailVerificationToken: {
        type: String,

    },

    emailVerificationExpiry: {
        type: Date
    }

}, {
    timestamps: true
});

//mongoose allow write hooks inside schema pre hook or post hook before and after save the data into database.

// So, here i use pre-hook for password encryption before save the user data into database.

userSchema.pre("save", async function (req, res, next) {

    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//mongoose allow write methods inside Schema

// I write methods for compare-password 

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


// METHODS FOR GENERATE ACCESS-TOEKN WITH DATA
userSchema.methods.generateAccessToken = function () {
    jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


// METHODS FOR GENERATE REFRESH-TOEKN WITH DATA
userSchema.methods.generateRefreshToken = function () {

    jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}

//  METHODS FOR GENERATE TEMPORARY-TOEKN WITH DATA
userSchema.methods.generateTemporaryToken = function () {

    const unHashedToken = crypto.randomBytes(50).toString("hex"); // generate string with help of crypto module of node.js

    const hashedToken = crypto
        .createHmac("sha256")
        .update(unHashedToken)
        .digest("hex")

    const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20min
    return { unHashedToken, hashedToken , tokenExpiry }
}


const userModel = mongoose.model("user", userSchema);

export default userModel;

