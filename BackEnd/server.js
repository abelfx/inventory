const express = require("express");
const session = require("express-session");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  })
);

// Session configuration
app.use(
  session({
    secret: "your-secret-key", // Change this to a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// CSRF protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});

// Apply CSRF protection to all routes
app.use(csrfProtection);

// CSRF token endpoint
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Error handler for CSRF token errors
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      error: "Invalid CSRF token",
      message: "Form submission failed. Please try again.",
    });
  }
  next(err);
});

// Product routes with CSRF protection
app.post("/api/addProduct", csrfProtection, async (req, res) => {
  try {
    // Validate input
    const { name, description, catagory, price, quantityInStock, supplierId } =
      req.body;

    if (
      !name ||
      !description ||
      !catagory ||
      !price ||
      !quantityInStock ||
      !supplierId
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate data types and ranges
    if (typeof name !== "string" || name.length > 100) {
      return res.status(400).json({ error: "Invalid product name" });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({ error: "Invalid price" });
    }

    if (!Number.isInteger(quantityInStock) || quantityInStock < 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    if (!Number.isInteger(supplierId) || supplierId < 1) {
      return res.status(400).json({ error: "Invalid supplier ID" });
    }

    // Add your product creation logic here
    // const product = await Product.create({ ... });

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Other routes with CSRF protection
app.get("/api/getProducts", csrfProtection, async (req, res) => {
  try {
    // Add your product fetching logic here
    res.json([]); // Replace with actual products
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/updateProduct/:id", csrfProtection, async (req, res) => {
  try {
    // Add your product update logic here
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/deleteProduct/:id", csrfProtection, async (req, res) => {
  try {
    // Add your product deletion logic here
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
