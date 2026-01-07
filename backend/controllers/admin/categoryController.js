const Category = require("../../models/categoryModel");

//[Post]-admin-create
const createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl, parentCategory } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(404).json({
          success: false,
          message: "Parent category does not exist",
        });
      }
    }

    const newCategory = new Category({
      name,
      description,
      imageUrl,
      parentCategory: parentCategory || null,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Successfully created a category",
      data: newCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

//[Get] - All Category- admin
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parentCategory", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

//[Get]- By ID - admin
const getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parentCategory",
      "name"
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "No category found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

//[put]- update category - admin
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, parentCategory } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "No category found",
      });
    }

    if (parentCategory && parentCategory === id) {
      return res.status(400).json({
        success: false,
        message: "Cannot set a category as its own parent",
      });
    }

    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(404).json({
          success: false,
          message: "Parent category does not exist",
        });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, imageUrl, parentCategory },
      { new: true, runValidators: true }
    ).populate("parentCategory", "name");

    res.status(200).json({
      success: true,
      message: "Catalog updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

//[Delete] delete category- admin
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "No category found",
      });
    }

    const hasChildren = await Category.findOne({ parentCategory: id });
    if (hasChildren) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete a category with subcategories. Please delete the subcategories first",
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};


module.exports = {createCategory, getAllCategories,getById,updateCategory,deleteCategory};