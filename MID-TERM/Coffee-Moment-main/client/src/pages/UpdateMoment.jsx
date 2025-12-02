import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Coffee, Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getAllCafeNames } from "../api/cafeApi";
import { getMomentById, updateMoment } from "../api/momentApi";

const formatNumber = (value) => {
  if (value === "" || value == null) return "";
  const num = Number(value.toString().replace(/\D/g, ""));
  return isNaN(num) ? "" : num.toLocaleString("en-US");
};
const parseNumber = (value) =>
  value === "" || value == null
    ? 0
    : Number(value.toString().replace(/\D/g, ""));

// Convert ISO (from backend) -> "YYYY-MM-DDTHH:MM" (local) for datetime-local input
const isoToInputLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

// Convert "YYYY-MM-DDTHH:MM" (local input) -> ISO string (UTC) for backend
const inputLocalToISO = (input) => {
  if (!input) return "";
  const d = new Date(input); // interprets as local time
  return d.toISOString();
};

export default function UpdateMoment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cafeId: "",
    selectedDrinks: [{ drinkName: "", price: "", quantity: "" }],
    totalPrice: "",
    imageUrl: "",
    description: "",
    dateTime: "",
  });
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  // scroll top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // fetch moment + cafes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [momentRes, cafeRes] = await Promise.all([
          getMomentById(id),
          getAllCafeNames(),
        ]);

        const m = momentRes.data;
        setFormData({
          cafeId: m.cafeId?._id || "",
          selectedDrinks: m.selectedDrinks?.map((d) => ({
            drinkName: d.drinkName ?? "",
            price: d.price != null ? formatNumber(d.price) : "",
            quantity: d.quantity ?? "",
          })) || [{ drinkName: "", price: "", quantity: "" }],
          totalPrice: m.totalPrice != null ? formatNumber(m.totalPrice) : "",
          imageUrl: m.imageUrl || "",
          description: m.description || "",
          dateTime: m.dateTime ? isoToInputLocal(m.dateTime) : "",
        });

        setCafes(
          Array.isArray(cafeRes.data) ? cafeRes.data : cafeRes.data.data
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Cannot load moment or cafe list");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "totalPrice") {
      setFormData((prev) => ({ ...prev, [name]: formatNumber(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDrinkChange = (index, field, value) => {
    const updated = [...formData.selectedDrinks];
    if (field === "price") {
      updated[index][field] = formatNumber(value);
    } else if (field === "quantity") {
      const v = value.toString().replace(/\D/g, "");
      updated[index][field] = v;
    } else {
      updated[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, selectedDrinks: updated }));
  };

  const addDrink = () =>
    setFormData((prev) => ({
      ...prev,
      selectedDrinks: [
        ...prev.selectedDrinks,
        { drinkName: "", price: "", quantity: "" },
      ],
    }));

  const removeDrink = (index) =>
    setFormData((prev) => ({
      ...prev,
      selectedDrinks: prev.selectedDrinks.filter((_, i) => i !== index),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        dateTime: formData.dateTime ? inputLocalToISO(formData.dateTime) : null,
        totalPrice: parseNumber(formData.totalPrice),
        selectedDrinks: formData.selectedDrinks.map((d) => ({
          drinkName: d.drinkName,
          price: parseNumber(d.price),
          quantity: Number(d.quantity) || 0,
        })),
      };

      await updateMoment(id, payload);
      toast.success("Moment updated successfully!");
      navigate("/moment-manage");
    } catch (error) {
      console.error("Error updating moment:", error);
      toast.error("Failed to update moment!");
    }
  };

  if (loading) return <div className="p-6">Loading data...</div>;

  return (
    <section className="bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Coffee className="text-amber-600 w-8 h-8" />
            <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              Update Moment
            </span>
          </h2>
          <button
            onClick={() => navigate("/moment-manage")}
            type="button"
            className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors duration-200 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Cafe */}
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Cafe
              </label>
              <select
                name="cafeId"
                value={formData.cafeId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              >
                <option value="">-- Select a cafe --</option>
                {cafes.map((cafe) => (
                  <option key={cafe._id} value={cafe._id}>
                    {cafe.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DateTime */}
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* Selected Drinks */}
            <div className="space-y-3">
              <label className="block text-stone-700 font-medium">
                Selected Drinks
              </label>
              {formData.selectedDrinks.map((drink, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <input
                    type="text"
                    placeholder="Drink Name"
                    value={drink.drinkName}
                    onChange={(e) =>
                      handleDrinkChange(index, "drinkName", e.target.value)
                    }
                    className="col-span-4 px-4 py-2 border border-stone-200 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Price"
                    value={drink.price}
                    onChange={(e) =>
                      handleDrinkChange(index, "price", e.target.value)
                    }
                    className="col-span-3 px-4 py-2 border border-stone-200 rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Quantity"
                    value={drink.quantity}
                    onChange={(e) =>
                      handleDrinkChange(index, "quantity", e.target.value)
                    }
                    className="col-span-3 px-4 py-2 border border-stone-200 rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeDrink(index)}
                    className="col-span-2 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addDrink}
                className="flex items-center gap-2 text-amber-600 hover:text-amber-800 font-medium"
              >
                <Plus size={18} /> Add Drink
              </button>
            </div>

            {/* Total Price */}
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Total Price
              </label>
              <input
                type="text"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Example: 25,000"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Image URL
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-6 py-3 rounded-lg hover:opacity-90 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Save size={20} />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
