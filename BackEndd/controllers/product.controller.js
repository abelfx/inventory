const Product = require("../models/Product");

// Input validation helper
const validateProductInput = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== "string" || data.name.length > 100) {
    errors.push("Invalid product name");
  }

  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.length > 500
  ) {
    errors.push("Invalid product description");
  }

  if (
    !data.catagory ||
    typeof data.catagory !== "string" ||
    data.catagory.length > 50
  ) {
    errors.push("Invalid category");
  }

  if (typeof data.price !== "number" || data.price < 0) {
    errors.push("Invalid price");
  }

  if (!Number.isInteger(data.quantityInStock) || data.quantityInStock < 0) {
    errors.push("Invalid quantity");
  }

  if (!Number.isInteger(data.supplierId) || data.supplierId < 1) {
    errors.push("Invalid supplier ID");
  }

  return errors;
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, catagory, price, quantityInStock, supplierId } =
      req.body;

    const product = new Product({
      name,
      description,
      catagory,
      price,
      quantityInStock,
      supplierId,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const { name, description, catagory, price, quantityInStock, supplierId } =
      req.body;

    // Validate input
    const validationErrors = validateProductInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, catagory, price, quantityInStock, supplierId },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { category, stockLevel, supplierId } = req.query;
    const query = {};

    if (category) {
      query.catagory = { $regex: category, $options: "i" };
    }

    if (stockLevel) {
      const [min, max] = stockLevel.split("-").map(Number);
      if (isNaN(min) || isNaN(max) || min < 0 || max < min) {
        return res.status(400).json({ message: "Invalid stock level range" });
      }
      query.quantityInStock = { $gte: min, $lte: max };
    }

    if (supplierId) {
      const supplierIdNum = parseInt(supplierId);
      if (isNaN(supplierIdNum) || supplierIdNum < 1) {
        return res.status(400).json({ message: "Invalid supplier ID" });
      }
      query.supplierId = supplierIdNum;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({
      message: "Error filtering products",
      error: error.message,
    });
  }
};
