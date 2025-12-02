import React, { useEffect, useState, useCallback } from "react";
import {
  Coffee,
  Plus,
  Pencil,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllCafes, deleteCafe } from "../api/cafeApi";
import CafeFilter from "../components/CafeFilter";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { debounce } from "../utils/debounce";

const CafeManage = () => {
  const navigate = useNavigate();
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    minRating: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    }, 500),
    []
  );

  const fetchCafes = async () => {
    setLoading(true);
    try {
      const res = await getAllCafes(filters);
      setCafes(res.data.data);
      setPagination({
        total: res.data.pagination.totalItems,
        totalPages: res.data.pagination.totalPages,
      });
    } catch {
      toast.error("Failed to load cafes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, [filters]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this cafe?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCafe(id);
          toast.success("Deleted successfully");
          fetchCafes();
        } catch {
          toast.error("Failed to delete cafe");
        }
      }
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl shadow-md">
            <Coffee className="text-amber-50 w-7 h-7" />
          </div>
          <h1 className="text-2xl uppercase md:text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
            Cafe Management
          </h1>
        </div>
        <button
          onClick={() => navigate("/create-cafe")}
          className="flex items-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold uppercase shadow-md transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,140,0,0.7)] hover:brightness-110 active:scale-95 justify-center"
        >
          <Plus size={18} className="text-white" />
          <span>Add Cafe</span>
        </button>
      </div>

      {/* Filters */}
      <CafeFilter
        filters={filters}
        onSearchChange={(value) => {
          setFilters((prev) => ({ ...prev, search: value }));
          debouncedSearch(value);
        }}
        onRatingChange={(value) =>
          setFilters((prev) => ({ ...prev, minRating: value || "", page: 1 }))
        }
        onSortChange={(sortBy, sortOrder) =>
          setFilters((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }))
        }
        onReset={() =>
          setFilters({
            search: "",
            minRating: "",
            sortBy: "createdAt",
            sortOrder: "desc",
            page: 1,
            limit: 10,
          })
        }
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-amber-100 mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-100">
            <thead className="bg-gradient-to-r from-amber-600 to-amber-800">
              <tr>
                {[
                  { name: "Cafe Name", key: "name" },
                  { name: "Image", key: "image" },
                  { name: "Address", key: "address" },
                  { name: "Description", key: "description" },
                  { name: "Rating", key: "rating" },
                  { name: "Actions", key: "actions" },
                ].map((h) => (
                  <th
                    key={h.key}
                    className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider"
                  >
                    {h.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    </div>
                  </td>
                </tr>
              ) : cafes.length > 0 ? (
                cafes.map((cafe) => (
                  <tr
                    key={cafe._id}
                    className="hover:bg-amber-50/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-stone-900 min-w-[180px]">
                      {cafe.name}
                    </td>
                    <td className="px-6 py-4">
                      {cafe.imageUrl && (
                        <div className="w-50 h-auto rounded-lg overflow-hidden shadow-sm border border-stone-200">
                          <img
                            src={cafe.imageUrl}
                            alt={cafe.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600 max-w-xs min-w-xs">
                      {cafe.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600 max-w-xs min-w-xs">
                      {cafe.description}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-600 font-medium">{cafe.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < Math.floor(cafe.rating)
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-stone-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/update-cafe/${cafe._id}`)}
                          className="p-5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105 transition-all duration-200"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cafe._id)}
                          className="p-5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition-all duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-stone-500">
                    No cafes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center gap-2 bg-white border border-amber-300 rounded-lg shadow-sm px-3 py-1">
            <button
              onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
              disabled={filters.page === 1}
              className={`p-2 rounded-md transition-colors ${
                filters.page === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-amber-600 hover:bg-amber-100"
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-medium text-gray-700">
              Page <span className="text-amber-600">{filters.page}</span> / {pagination.totalPages}
            </span>

            <button
              onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
              disabled={filters.page === pagination.totalPages}
              className={`p-2 rounded-md transition-colors ${
                filters.page === pagination.totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-amber-600 hover:bg-amber-100"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeManage;
