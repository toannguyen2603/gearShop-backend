const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productModel = Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
        },
        slug: {
            type: String,
            require: true,
            trim: true,
        },
        price: {
            type: Number,
            require: true,
        },
        description: {
            type: String,
            require: true,
            trim: true,
        },
        offer: {
            type: Number,
        },
        productImages: [
            {
                img: {
                    type: String,
                },
            },
        ],
        reviews: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                review: String,
            },
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            require: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
    },
    { timestamps: true },
);

const productSchema = mongoose.model("Product", productModel);

module.exports = productSchema;
