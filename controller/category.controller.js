const Category = require("../models/category.model");
const slugify = require("slugify");
const shortid = require("shortid");
// check categories parentID is duplicated
function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((v) => v.parentId == undefined);
  } else {
    category = categories.filter((v) => (v.parentId = parentId));
  }

  for (let type of category) {
    categoryList.push({
      _id: type._id,
      name: type.name,
      type: type.type,
      slug: type.slug,
      parentId: type.parentId,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

const addCategory = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    createBy: req.user._id,
  };

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);

  cat.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) {
      return res.status(201).json({ category });
    }
  });
};

module.exports = addCategory;
