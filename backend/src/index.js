const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "echowood_super_secret_key";

app.use(cors());
app.use(express.json());

// --- STATIC FILE SERVING (For Images) ---
// Access images via: http://your-ip:4000/uploads/filename.jpg
app.use('/uploads', express.static('uploads'));

// --- MULTER CONFIG (Image Uploads) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Save as: timestamp-filename.jpg
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// --- MIDDLEWARE: Protect Admin Routes ---
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: "No token provided" });
  
  try {
    const bearer = token.split(' ')[1]; // Remove "Bearer "
    const decoded = jwt.verify(bearer, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// ==========================
// PUBLIC ROUTES
// ==========================

// 1. Get Products (Search, Filter, & Featured)
app.get("/products", async (req, res) => {
  const { search, category, minPrice, maxPrice, featured, limit } = req.query;

  try {
    // Build Dynamic Filter
    const whereClause = {
      isActive: true, // Only show active products
    };

    // A. Search Logic (Name or Description)
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // B. Category Filter
    if (category) {
      whereClause.category = {
        slug: category 
      };
    }

    // C. Featured Filter (For Widgets)
    if (featured === 'true') {
      whereClause.isFeatured = true;
    }

    // D. Price Filter
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { id: 'desc' }, // Newest first
      take: limit ? parseInt(limit) : undefined // Limit results (e.g., Top 4)
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// ... Keep other routes same ...
// 2. Get Single Product
app.get("/products/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================
// ADMIN ROUTES
// ==========================

// 3. Admin Login
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// 4. Upload Image (Protected)
app.post("/admin/upload", verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // Return relative path
  const fileUrl = `/uploads/${req.file.filename}`; 
  res.json({ url: fileUrl });
});

// 5. Create Product (Protected)
app.post("/products", verifyToken, async (req, res) => {
  const { name, slug, price, description, imageUrl, categoryId, stock } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        imageUrl, 
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        categoryId: categoryId ? parseInt(categoryId) : null
      }
    });
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Could not create product. Slug must be unique." });
  }
});

// 6. Update Product (Protected - Full Edit Capability)
app.patch("/products/:slug", verifyToken, async (req, res) => {
  const { slug } = req.params;
  const { name, description, imageUrl, stock, price, isActive, newSlug } = req.body;
  
  try {
    // Dynamically build update object
    const dataToUpdate = {
      ...(name && { name }),
      ...(description && { description }),
      ...(imageUrl && { imageUrl }),
      ...(stock !== undefined && { stock: parseInt(stock) }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(isActive !== undefined && { isActive }),
      // Allow updating slug if 'newSlug' is sent
      ...(newSlug && { slug: newSlug }) 
    };

    const updated = await prisma.product.update({
      where: { slug },
      data: dataToUpdate,
    });
    res.json(updated);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({ error: "Update failed" });
  }
});
// 7. Get All Categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch categories" });
  }
});
app.listen(PORT, () => {
  console.log(`🔥 Echowood Engine running on Port ${PORT}`);
});