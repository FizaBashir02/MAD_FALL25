import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Coffee, Save, ArrowLeft, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getMomentById } from "../api/momentApi";

const DEFAULT_COFFEES = [
  { name: "Espresso", price: 250, image: "https://levalorcafe.com/pictures/9zbnj7qnl3.jpg" },
  { name: "Cappuccino", price: 350, image: "https://www.allrecipes.com/thmb/chsZz0jqIHWYz39ViZR-9k_BkkE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/8624835-how-to-make-a-cappuccino-beauty-4x3-0301-13d55eaad60b42058f24369c292d4ccb.jpg" },
  { name: "Latte", price: 400, image: "https://img.freepik.com/free-photo/caramel-latte-table_140725-4503.jpg" },
  { name: "Americano", price: 300, image: "https://lh6.googleusercontent.com/proxy/toB9ibg8k3jWwvqG-nBNnnV7OgFXjlhlGDwjWWUYugYpI0RdrA-2ORfxAOgSRUxiHGMlimvgpMOq7ie4ZxhmDRNRInx2jk_-lAocF0EO3MKs1G4" },
  { name: "Mocha", price: 450, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW5WGYUIct8LEYMB7y3tVIQ8nvctst6J72MQ&s" },
];

const formatNumber = (value) =>
  value ? Number(value.toString().replace(/\D/g, "")).toLocaleString("en-US") : "";

const parseNumber = (value) =>
  value ? Number(value.toString().replace(/\D/g, "")) : 0;

export default function UpdateMoment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    selectedCoffees: [],
    totalPrice: "",
    description: "",
    dateTime: "",
    orderType: "carry",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMoment = async () => {
      try {
        const res = await getMomentById(id);
        const m = res.data;

        setFormData({
          selectedCoffees: m.selectedDrinks || [],
          totalPrice: formatNumber(m.totalPrice),
          description: m.description || "",
          dateTime: m.dateTime?.slice(0, 16) || "",
          orderType: m.orderType || "carry",
        });
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadMoment();
  }, [id]);

  const addCoffeeToOrder = (coffee) => {
    const updated = [...formData.selectedCoffees, { ...coffee, quantity: 1 }];
    updatePrices(updated);
  };

  const changeQuantity = (index, qty) => {
    const updated = [...formData.selectedCoffees];
    updated[index].quantity = Number(qty);
    updatePrices(updated);
  };

  const removeCoffee = (index) => {
    const updated = formData.selectedCoffees.filter((_, i) => i !== index);
    updatePrices(updated);
  };

  const updatePrices = (coffeeList) => {
    const total = coffeeList.reduce(
      (acc, c) => acc + c.price * c.quantity,
      0
    );
    setFormData({
      ...formData,
      selectedCoffees: coffeeList,
      totalPrice: formatNumber(total),
    });
  };

  // ✅ NOW ONLY SHOW SUCCESS MESSAGE (NO API CALL)
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Order Saved Successfully!");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <section className="bg-stone-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Coffee className="text-amber-600" /> Choose Your Coffee
          </h2>
          <button onClick={() => navigate("/moment-manage")} className="text-amber-700 flex gap-1">
            <ArrowLeft /> Back
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mb-8">
          {DEFAULT_COFFEES.map((c, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-4 shadow hover:shadow-lg cursor-pointer"
              onClick={() => addCoffeeToOrder(c)}
            >
              <img src={c.image} className="w-full h-24 object-cover rounded" />
              <p className="text-center font-semibold mt-2">{c.name}</p>
              <p className="text-center text-amber-600">Rs {c.price}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
          <label className="font-medium">Selected Coffee Order</label>
          
          {formData.selectedCoffees.map((coffee, index) => (
            <div key={index} className="flex items-center gap-4 border p-3 rounded">
              <span className="flex-1">{coffee.name}</span>
              <span>Rs {coffee.price}</span>
              <input type="number" min="1" value={coffee.quantity}
                onChange={(e) => changeQuantity(index, e.target.value)}
                className="w-16 p-2 border rounded" />
              <button type="button" onClick={() => removeCoffee(index)}
                className="text-red-600"><Trash2 /></button>
            </div>
          ))}

          <div>
            <label>Total Price</label>
            <input className="w-full p-3 border rounded" value={formData.totalPrice} disabled />
          </div>

          <button type="submit"
            className="bg-amber-700 w-full text-white py-3 rounded-lg hover:opacity-90 flex justify-center gap-2">
            <Save /> Save Order
          </button>
        </form>

      </div>
    </section>
  );
}
