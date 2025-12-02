require("dotenv").config(); // Load environment variables first
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/items", require("./routes/items"));
app.use("/api/payment", require("./routes/payment"));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
