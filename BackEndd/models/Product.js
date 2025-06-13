const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    catagory: { type: String, required: true },
    price: { type: Number, required: true },
    quantityInStock: { type: Number, required: true },
    supplierId: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
