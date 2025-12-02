// UpdateMoment.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Coffee, Save, ArrowLeft, Plus, Trash2, Search, ChevronDown, X, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { getAllCoffees } from "../api/coffeeApi"; // Fetch all coffees
import { getMomentById, updateMoment } from "../api/momentApi";

// Format number for display
const formatNumber = (value) => {
  if (value === "" || value == null) return "";
  const num = Number(value.toString().replace(/\D/g, ""));
  return isNaN(num) ? "" : num.toLocaleString("en-US");
};
const parseNumber = (value) =>
  value === "" || value == null ? 0 : Number(value.toString().replace(/\D/g, ""));

// ISO <-> datetime-local conversion
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
const inputLocalToISO = (input) => {
  if (!input) return "";
  const d = new Date(input);
  return d.toISOString();
};

// Coffee Filter Component
const CoffeeFilter = ({ filters, coffees, onSearchChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredCoffees = coffees.filter((c) =>
    c.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <section className="mb-5">
      <div className="flex justify-between items-center md:hidden mb-5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-amber-900 text-white py-3 px-5 text-lg font-semibold rounded-lg shadow-lg transition-colors"
        >
          <Filter size={18} />
          Filter
        </button>
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div
        className={`mt-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-6
          ${isOpen ? "block" : "hidden"} md:block`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium text-amber-700">
              Search Coffees
            </label>
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
          <button
            onClick={onReset}
            className="h-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow transition"
            type="button"
          >
            Reset
          </button>
        </div>
        {/* List of coffees */}
        {filteredCoffees.length > 0 && (
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {filteredCoffees.map((c) => (
              <div key={c._id} className="p-2 border rounded-lg flex justify-between items-center">
                <span>{c.name}</span>
                <span className="text-amber-600 font-medium">${c.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default function UpdateMoment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    selectedCoffees: [{ coffeeId: "", quantity: "", price: "" }],
    totalPrice: "",
    imageUrl: "",
    description: "",
    dateTime: "",
  });
  const [coffees, setCoffees] = useState([]);
  const [filters, setFilters] = useState({ search: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  // Fetch moment + coffee list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [momentRes, coffeeRes] = await Promise.all([
          getMomentById(id),
          getAllCoffees(),
        ]);

        const m = momentRes.data;
        setFormData({
          selectedCoffees: m.selectedCoffees?.map((d) => ({
            coffeeId: d.coffeeId?._id || "",
            quantity: d.quantity || "",
            price: d.price != null ? formatNumber(d.price) : "",
          })) || [{ coffeeId: "", quantity: "", price: "" }],
          totalPrice: m.totalPrice != null ? formatNumber(m.totalPrice) : "",
          imageUrl: m.imageUrl || "",
          description: m.description || "",
          dateTime: m.dateTime ? isoToInputLocal(m.dateTime) : "",
        });

        setCoffees(Array.isArray(coffeeRes.data) ? coffeeRes.data : coffeeRes.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "totalPrice") setFormData((prev) => ({ ...prev, [name]: formatNumber(value) }));
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoffeeChange = (index, field, value) => {
    const updated = [...formData.selectedCoffees];
    if (field === "price") updated[index][field] = formatNumber(value);
    else if (field === "quantity") updated[index][field] = value.replace(/\D/g, "");
    else updated[index][field] = value;
    setFormData((prev) => ({ ...prev, selectedCoffees: updated }));
  };

  const addCoffee = () => setFormData((prev) => ({
    ...prev,
    selectedCoffees: [...prev.selectedCoffees, { coffeeId: "", quantity: "", price: "" }],
  }));

  const removeCoffee = (index) => setFormData((prev) => ({
    ...prev,
    selectedCoffees: prev.selectedCoffees.filter((_, i) => i !== index),
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        dateTime: formData.dateTime ? inputLocalToISO(formData.dateTime) : null,
        totalPrice: parseNumber(formData.totalPrice),
        selectedCoffees: formData.selectedCoffees.map((d) => ({
          coffeeId: d.coffeeId,
          quantity: Number(d.quantity) || 0,
          price: parseNumber(d.price),
        })),
      };
      await updateMoment(id, payload);
      toast.success("Moment updated successfully!");
      navigate("/moment-manage");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update moment!");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

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
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Coffee Filter */}
        <CoffeeFilter
          filters={filters}
          coffees={coffees}
          onSearchChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          onReset={() => setFilters({ search: "" })}
        />

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* DateTime */}
            <div>
              <label className="block text-stone-700 font-medium mb-2">Date & Time</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* Selected Coffees */}
            <div className="space-y-3">
              <label className="block text-stone-700 font-medium">Ordered Coffees</label>
              {formData.selectedCoffees.map((c, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-center">
                  <select
                    value={c.coffeeId}
                    onChange={(e) => handleCoffeeChange(i, "coffeeId", e.target.value)}
                    className="col-span-4 px-4 py-2 border border-stone-200 rounded-lg"
                    required
                  >
                    <option value="">-- Select Coffee --</option>
                    {coffees.map((coffee) => (
                      <option key={coffee._id} value={coffee._id}>
                        {coffee.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Price"
                    value={c.price}
                    onChange={(e) => handleCoffeeChange(i, "price", e.target.value)}
                    className="col-span-3 px-4 py-2 border border-stone-200 rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Quantity"
                    value={c.quantity}
                    onChange={(e) => handleCoffeeChange(i, "quantity", e.target.value)}
                    className="col-span-3 px-4 py-2 border border-stone-200 rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeCoffee(i)}
                    className="col-span-2 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCoffee}
                className="flex items-center gap-2 text-amber-600 hover:text-amber-800 font-medium"
              >
                <Plus size={18} /> Add Coffee
              </button>
            </div>

            {/* Total Price */}
            <div>
              <label className="block text-stone-700 font-medium mb-2">Total Price</label>
              <input
                type="text"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. 25,000"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-stone-700 font-medium mb-2">Image URL</label>
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
              <label className="block text-stone-700 font-medium mb-2">Description</label>
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
