import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectToMongoDB from "./db/connectToMongoDB.js";
import routes from "./routes/routes.js";
import coffeeRoutes from "./routes/coffeeRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed Frontend Origins
const corsOptions = {
  origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ Main Routes
app.use("/api", routes);
app.use("/api/coffees", coffeeRoutes);
app.use("/api/orders", orderRoutes);   // ✅ Moved HERE (after app is created)

// ✅ Start Server + DB
app.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`✅ Server running on port ${PORT}`);
});
