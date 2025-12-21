import express from "express";

const router = express.Router();

const coffees = [
  { _id: "1", name: "Espresso", price: 300 },
  { _id: "2", name: "Cappuccino", price: 450 },
  { _id: "3", name: "Latte", price: 500 },
  { _id: "4", name: "Mocha", price: 550 },
  { _id: "5", name: "Cold Coffee", price: 400 },
];

router.get("/", (req, res) => {
  res.json(coffees);
});

export default router;
