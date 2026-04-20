import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/SubCategory.model.js";


export async function createProduct(req, res) {
  try {
       // 👇 PUT IT HERE
    console.log("req.body:", req.body);
    console.log("subcategory:", req.body.subcategory);
    const { name, description, price, stock, category,subcategory } = req.body;

    // Basic field validation
    if (!name || !description || !price || !stock || !category || !subcategory) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check the category actually exists in DB
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Image validation
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    if (req.files.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images allowed" });
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: "products" })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category: category._id || category,
      subcategory: subcategory._id || subcategory,  
      images: imageUrls,
    });


    const populatedProduct = await product.populate("category");

    res.status(201).json(populatedProduct);
  } catch (error) {
   
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid category ID format" });
    }
    console.error("Error creating product", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getAllProducts(_, res) {
  try {
    const products = await Product.find()
      .populate("category")   
      .populate("subcategory")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category,subcategory} = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
      product.category = category;
    }

    if (subcategory) {
      const subcategoryExists = await SubCategory.findById(subcategory);
      if (!subcategoryExists) {
        return res.status(404).json({ message: "Sub Category not found" });
      }
      product.subcategory = subcategory;
    }


    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ message: "Maximum 3 images allowed" });
      }

      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "products" })
      );

      const uploadResults = await Promise.all(uploadPromises);
      product.images = uploadResults.map((result) => result.secure_url);
    }

    await product.save();

   
    const populatedProduct = await product.populate("category");

    res.status(200).json(populatedProduct);
  } catch (error) {

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    console.error("Error updating products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createCategory(req, res) {
  try {
    const { name} = req.body;

    if (!name) {
      return res.status(400).json({ message: "field are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    if (req.files.length > 1) {
      return res.status(400).json({ message: "Maximum 1 image allowed" });
    }

    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "categories",
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults.map((result) => result.secure_url);

    const category = await Category.create({
      name,
      images: imageUrls,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }

    if (name) category.name = name;

    // handle image updates if new images are uploaded
    if (req.files && req.files.length > 0) {
      if (req.files.length > 1) {
        return res.status(400).json({ message: "Maximum 1 images allowed" });
      }

      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "categories",
        });
      });

      const uploadResults = await Promise.all(uploadPromises);
      category.images = uploadResults.map((result) => result.secure_url);
    }

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error("Error updating categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function getAllcategories(_, res) {
  try {
    // -1 means in desc order: most recent categories first
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}




export async function createSubCategory(req, res) {
  try {
    const { name,category} = req.body;

    if (!name) {
      return res.status(400).json({ message: "field are required" });
    }

    // ✅ Check the category actually exists in DB
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = await SubCategory.create({
      name,
      category: category._id || category,
     
    });

   const populatedSubCategory = await subcategory.populate("category");

    res.status(201).json(populatedSubCategory);
  } catch (error) {
   
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Subcategory ID format" });
    }
    console.error("Error creating sub category", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



export async function updateSubCategory(req, res) {
  try {
    const { id } = req.params;
    const { name,category } = req.body;

    const subcategory = await SubCategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({ message: "sub category not found" });
    }

    if (name) subcategory.name = name;
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
      subcategory.category = category;
    }

    await subcategory.save();

   
    const populatedSubCategory = await subcategory.populate("category");

    res.status(200).json(populatedSubCategory);
  } catch (error) {

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    console.error("Error updating Sub category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



export async function getAllSubCategories(_, res) {
  try {
    // -1 means in desc order: most recent subcategories first
    const subcategories = await SubCategory.find()
    .populate("category")
    .sort({ createdAt: -1 });
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching sub categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const productsCount = await Product.countDocuments({ subcategory: id });
    if (productsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete: this category has ${productsCount} product${productsCount > 1 ? "s" : ""} linked to it.`,
      });
    }

    const subcategory= await SubCategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({ message: "sub Cateogry not found" });
    }

    await SubCategory.findByIdAndDelete(id);
    res.status(200).json({ message: "Sub Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete sub category" });
  }
};




export async function getAllOrders(_, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.Product")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });

  } catch (error) {
    console.error("🔥 getAllOrders ERROR:", error);

    return res.status(500).json({
      error: error.message,
      name: error.name,
      code: error.code,
    });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error in updateOrderStatus controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllCustomers(_, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 }); // latest user first
    res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getDashboardStats(_, res) {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((imageUrl) => {
        const publicId = "products/" + imageUrl.split("/products/")[1]?.split(".")[0];
        if (publicId) return cloudinary.uploader.destroy(publicId);
      });
      await Promise.all(deletePromises.filter(Boolean));
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subcategoriesCount = await SubCategory.countDocuments({ category: id });
    if (subcategoriesCount > 0) {
      return res.status(400).json({
        message: `Cannot delete: this category has ${subcategoriesCount} subcategor${subcategoriesCount > 1 ? "ies" : "y"} linked to it.`,
      });
    }


    // Check if any products exist under this category
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete: this category has ${productsCount} product${productsCount > 1 ? "s" : ""} linked to it.`,
      });
    }


    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Cateogry not found" });
    }

    // Delete images from Cloudinary
    if (category.images && category.images.length > 0) {
      const deletePromises = category.images.map((imageUrl) => {
        // Extract public_id from URL (assumes format: .../category/publicId.ext)
        const publicId = "categories/" + imageUrl.split("/categories/")[1]?.split(".")[0];
        if (publicId) return cloudinary.uploader.destroy(publicId);
      });
      await Promise.all(deletePromises.filter(Boolean));
    }

    await   Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};