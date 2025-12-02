import express from "express";

const router = express.Router();

let orders = []; // temporary in-memory storage

// Save order
router.post("/", (req, res) => {
  const { items, totalPrice } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ message: "Order must have at least one item" });
  }

  const newOrder = {
    id: orders.length + 1,
    items,
    totalPrice,
    date: new Date()
  };

  orders.push(newOrder);

  return res.status(201).json({ message: "Order saved successfully", order: newOrder });
});

// Get all orders (optional)
router.get("/", (req, res) => {
  res.json(orders);
});

export default router;
