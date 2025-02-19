import mongoose from "mongoose";
import dbLogger from "../middlewares/dbLogger.middleware.js";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "fullName is required"],
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, "email is required"],
            trim: true,
            unique: true,
            index: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]/,
                "Please fill a valid email address",
            ],
        },
        contactNumber: {
            type: String,
            required: [true, "contactNumber is required"],
            trim: true,
            index: true,
            unique: true,
            match: [/^[0-9]{10}$/, "Please fill a valid contact number"],
        },
        userName: {
            type: String,
            required: [true, "userName is required"],
            trim: true,
            index: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
            trim: true,
            index: true,
        },
        role: {
            type: String,
            default: "employee",
            trim: true,
            index: true,
            enum: ["admin", "employee"],
        },
        status: {
            type: String,
            required: [true, "status is required"],
            trim: true,
            enum: ["active", "inactive"],
            default: "active",
        },
        salary: {
            type: Number
        },
        org: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            trim: true,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.pre("save", function (next) {
    if (this.isNew && this.role === "admin" && !this.createdBy) {
        this.createdBy = this._id;
    }
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    const token = jwt.sign(
        {
            id: this._id,
            username: this.username,
            emaiL: this.email,
            fullname: this.fullname,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiry }
    );
    return token;
};

userSchema.pre("save", dbLogger("User"));
export const User = mongoose.model("User", userSchema);
