const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
        },
        universityID: {
            type: String,
            required: [true, "Please enter your University ID"],
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
        },
        role: {
            type: String,
            default: "student",
        },
        
    },
    {
        timestamps: true,
    }
);

const model = mongoose.model("User", userSchema);

module.exports = model;