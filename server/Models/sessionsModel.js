const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
        "date":{
            type: String,
            required: [true, "Please enter the date"],
            trim: true
        },
        "studentID":{
            type: String,
            required: [true, "Please enter student's university ID"],
            trim: true
        }
    },
    {
        timestamps: true,
    }
)

const model = mongoose.model("Sessions", sessionSchema);

module.exports = model;
