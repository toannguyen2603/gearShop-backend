const Category = require("../models/category.model");
const slugify = require("slugify");
const shortid = require("shortid");

//TODO: check categories parentID is duplicated

function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter((cat) => cat.parentId == undefined);
    } else {
        category = categories.filter((cat) => cat.parentId == parentId);
    }

    // TODO: create list of category
    // NOTE: create children category when adding "parentId"

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            type: cate.type,
            children: createCategories(categories, cate._id),
        });
    }
    //  return list

    return categoryList;
}

// TODO: add a category

const addCategory = (req, res) => {
    // attribute category
    const categoryObj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`,
        createdBy: req.user._id,
    };

    // adding "public" string in file image
    if (req.file) {
        categoryObj.categoryImage = "/public/" + req.file.filename;
    }

    // adding parentId in children list
    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }

    // create new category
    const cate = new Category(categoryObj);

    cate.save((error, category) => {
        if (error) return res.status(400).json({ error });
        if (category) {
            return res.status(201).json({ category });
        }
    });
};

// TODO: get all list of categories

const getCategories = (req, res) => {
    Category.find({}).exec((error, categories) => {
        if (error) return res.status(400).json({ error });
        // check condition

        if (categories) {
            const categoryList = createCategories(categories);
            res.status(200).json({ categoryList });
        }
    });
};

// TODO: update a category with ID
const updateCategories = async (req, res) => {
    const { _id, name, parentId, type } = req.body;
    // Create new list update

    const updatedCategories = [];

    if (name instanceof Array) {
        for (let i = 0; i < name.length; i++) {
            const category = {
                name: name[i],
                type: type[i],
            };
            if (parentId[i] !== "") {
                category.parentId = parentId[i];
            }

            const updatedCategory = await Category.findOneAndUpdate({ _id: _id[i] }, category, { new: true });
            updatedCategories.push(updatedCategory);
        }
        return res.status(201).json({ updateCategories: updatedCategories });
    } else {
        const category = {
            name,
            type,
        };
        if (parentId !== "") {
            category.parentId = parentId;
        }
        const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
            new: true,
        });
        return res.status(201).json({ updatedCategory });
    }
};

// TODO: delete a category with ID
const deleteCategories = async (req, res) => {
    const { ids } = req.body.payload;
    const deletedCategories = [];
    for (let i = 0; i < ids.length; i++) {
        const deleteCategory = await Category.findOneAndDelete({
            _id: ids[i]._id,
            createdBy: req.user._id,
        });
        deletedCategories.push(deleteCategory);
    }

    if (deletedCategories.length == ids.length) {
        res.status(201).json({ message: "Categories removed" });
    } else {
        res.status(400).json({ message: "Something went wrong" });
    }
};

module.exports = { addCategory, getCategories, updateCategories, deleteCategories };
