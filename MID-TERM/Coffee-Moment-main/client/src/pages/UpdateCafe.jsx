import { useEffect, useState } from "react";
import { Coffee, Save, ArrowLeft, ImagePlus, MapPin, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getCafeById, updateCafe } from "../api/cafeApi";
import toast from "react-hot-toast";

const FormField = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="block text-stone-700 font-medium flex items-center gap-1">
      {icon}
      {label}
    </label>
    {props.type === "textarea" ? (
      <textarea
        {...props}
        className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
    ) : (
      <input
        {...props}
        className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
    )}
  </div>
);

export default function UpdateCafe() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    imageUrl: "",
    rating: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const res = await getCafeById(id);
        setFormData(res.data);
      } catch (err) {
        toast.error("Cannot load cafe data");
      } finally {
        setLoading(false);
      }
    };
    fetchCafe();
  }, [id]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCafe(id, formData);
      toast.success("Update successful");
      navigate("/cafe-manage");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="p-6">Loading data...</div>;

  return (
    <section className="bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-row sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-xl md:text-3xl font-bold flex items-center gap-3">
            <Coffee className="text-amber-600 w-8 h-8" />
            <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              Update Cafe
            </span>
          </h2>
          <button
            onClick={() => navigate("/cafe-manage")}
            className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg">
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Cafe Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter cafe name"
                required
                icon={<Coffee className="w-4 h-4 text-amber-500" />}
              />
              <FormField
                label="Rating"
                name="rating"
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={formData.rating}
                onChange={handleChange}
                placeholder="0 - 5"
                required
                icon={<Star className="w-4 h-4 text-amber-500" />}
              />
              <div className="md:col-span-2">
                <FormField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  required
                  icon={<MapPin className="w-4 h-4 text-amber-500" />}
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  icon={<ImagePlus className="w-4 h-4 text-amber-500" />}
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  label="Cafe Description"
                  name="description"
                  type="textarea"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ambiance, style, menu..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex md:justify-end pt-4 border-t border-stone-100">
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-6 py-3 rounded-lg hover:opacity-90 flex items-center gap-2 shadow-md hover:shadow-lg transition-all w-full justify-center md:w-auto"
              >
                <Save size={20} />
                <span className="font-medium">Save</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
