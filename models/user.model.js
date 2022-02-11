const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 20,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 20,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            unique: false,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        contactNumber: { type: String },
        pictureProfile: { type: String },
    },
    { timestamps: true },
);

// group of name
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// compare password
userSchema.methods = {
    authenticate: async function (password) {
        return await bcrypt.compare(password, this.password);
    },
};

module.exports = mongoose.model("User", userSchema);
