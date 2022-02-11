const slugify = require("slugify");

const Product = require("../models/product.model");
const Category = require("../models/category.model");
const { LookoutEquipment } = require("aws-sdk");

module.exports = {
    // TODO: CREATE PRODUCT
    createProduct: (req, res) => {
        // return res.status(200).json({
        //     file: req.files,
        //     body: req.body,
        //     length: req.files.length,
        // });
        // TODO: get product info

        const { name, price, description, category, quantity, createdBy } = req.body;

        // TODO: create a ArrayList of picture product

        const productImages = [];

        // TODO: check file image is existing
        if (req.files.length > 0) {
            productImages = req.files.map((file) => {
                return { img: file.filename };
            });
        }

        // TODO: create new a product
        const product = new Product({
            name: name,
            slug: slugify(name),
            price,
            quantity,
            description,
            productImages,
            category,
            createdBy: req.user._id,
        });

        // TODO: Save & return the newly created product info
        product.save();

        return res.status(200).json({
            product,
            files: req.files,
        });
    },
    // TODO: GET PRODUCT BY SLUG
    getProductBySlug: (req, res) => {
        try {
            const { slug } = req.params;

            const category = Category.findOne({ slug: slug }).select("_id type");

            if (!category) {
                return res.status(400).json({ error });
            }
            if (category) {
                Product.find({ category: category._id }).exec((error, products) => {
                    if (error) {
                        return res.status(400).json({ error });
                    }

                    if (category.type) {
                        if (products.length > 0) {
                            res.status(200).json({
                                products,
                                priceRange: {
                                    under5k: 5000,
                                    under10k: 10000,
                                    under15k: 15000,
                                    under20k: 20000,
                                    under30k: 30000,
                                },
                                productsByPrice: {
                                    under5k: products.filter((product) => product.price <= 5000),
                                    under10k: products.filter((product) => product.price > 5000 && product.price <= 10000),
                                    under15k: products.filter((product) => product.price > 10000 && product.price <= 15000),
                                    under20k: products.filter((product) => product.price > 15000 && product.price <= 20000),
                                    under30k: products.filter((product) => product.price > 20000 && product.price <= 30000),
                                },
                            });
                        }
                    } else {
                        res.status(200).json({ products });
                    }
                });
            }
        } catch (err) {
            console.error(err);
        }
    },
};
