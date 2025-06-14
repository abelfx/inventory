const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
const csrf = require("csurf");

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Apply CSRF protection and authentication to all product routes
router.use(csrfProtection);
router.use(isAuthenticated);

// Product routes
router.post("/addProduct", productController.addProduct);
router.get("/getProducts", productController.getProducts);
router.get("/getProduct/:id", productController.getProduct);
router.put("/updateProduct/:id", productController.updateProduct);
router.delete("/deleteProduct/:id", productController.deleteProduct);
router.get("/filter", productController.filterProducts);

module.exports = router;
