import React, { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Coffee, Eye, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import { getAllMoments, deleteMoment } from "../api/momentApi";
import { getAllCafeNames } from "../api/cafeApi";
import { formatCurrencyVND } from "../utils/formatCurrency";
import { formatDateTime } from "../utils/formatDateTime";
import { getTimeOfDay } from "../utils/getTimeOfDay";
import { debounce } from "../utils/debounce";

import MomentModal from "../components/MomentModal";
import MomentFilter from "../components/MomentFilter";

const MomentManage = () => {
  const navigate = useNavigate();

  // Data state
  const [moments, setMoments] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState(null);

  // Filter & sort state
  const [filters, setFilters] = useState({
    cafeId: "",
    timeOfDay: "",
    minPrice: "",
    maxPrice: "",
    dateFrom: "",
    dateTo: "",
  });
  const [sortOption, setSortOption] = useState({ sortBy: "", sortOrder: "" });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const debouncedFetchMoments = useCallback(
    debounce(() => fetchMoments(), 300),
    [filters, pagination.page, sortOption]
  );

  // Fetch cafe list
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllCafeNames();
        setCafes(res.data || []);
      } catch {
        toast.error("Unable to load cafe list");
      }
    })();
  }, []);

  const fetchMoments = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(sortOption.sortBy && sortOption.sortOrder ? sortOption : {}),
        ...filters,
      };

      // Remove empty values
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, v]) => v !== "" && v !== null && v !== undefined
        )
      );

      // Convert prices to numbers if provided
      if (cleanParams.minPrice !== undefined)
        cleanParams.minPrice = Number(cleanParams.minPrice);
      if (cleanParams.maxPrice !== undefined)
        cleanParams.maxPrice = Number(cleanParams.maxPrice);

      // Swap if min > max
      if (
        typeof cleanParams.minPrice === "number" &&
        typeof cleanParams.maxPrice === "number" &&
        cleanParams.minPrice > cleanParams.maxPrice
      ) {
        const tmp = cleanParams.minPrice;
        cleanParams.minPrice = cleanParams.maxPrice;
        cleanParams.maxPrice = tmp;
      }

      const res = await getAllMoments(cleanParams);

      setMoments(res.data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data.pagination?.totalItems || 0,
        totalPages: res.data.pagination?.totalPages || 1,
      }));
    } catch (err) {
      console.error("Error fetching moments:", err);
      toast.error("Unable to load moments");
      setMoments([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch when filters/page/sort change
  useEffect(() => {
    fetchMoments();
  }, [filters, pagination.page, sortOption]);

  // Reset page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters]);

  // Actions
  const handleViewMoment = (m) => {
    setSelectedMoment(m);
    setIsModalOpen(true);
  };

  const handleDeleteMoment = async (id) => {
    const result = await Swal.fire({
      title: "Confirm delete?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#fff8f0",
      backdrop: `rgba(253, 230, 208, 0.4)`,
    });

    if (result.isConfirmed) {
      await deleteMoment(id);
      toast.success("Moment deleted successfully");
      fetchMoments();
    }
  };

  const handleResetFilters = () => {
    setFilters({
      cafeId: "",
      timeOfDay: "",
      minPrice: "",
      maxPrice: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  return (
    <div className="p-4 md:p-6 bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl shadow-md">
            <Camera className="text-amber-50 w-7 h-7" />
          </div>
          <h1 className="text-2xl md:text-3xl uppercase font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
            Manage Moments
          </h1>
        </div>
        <button
          onClick={() => navigate("/create-moment")}
          className="flex items-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold uppercase shadow-md transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(255,140,0,0.7)] hover:brightness-110 active:scale-95 justify-center"
        >
          <Plus size={20} className="text-white" />
          <span>Add Moment</span>
        </button>
      </div>

      {/* Filter */}
      <MomentFilter
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        cafes={cafes}
        filters={filters}
        setFilters={setFilters}
        onApply={fetchMoments}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-amber-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-100">
            <thead className="bg-gradient-to-r from-amber-600 to-amber-800">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
                  Cafe
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 md:px-6 py-3 text-right text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-amber-800">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
                    </div>
                  </td>
                </tr>
              ) : moments.length > 0 ? (
                moments.map((moment) => (
                  <tr
                    key={moment._id}
                    className="hover:bg-amber-50/50 transition-colors duration-150"
                  >
                    <td className="px-4 md:px-6 py-4 font-medium text-amber-900">
                      <div className="flex items-center gap-2 min-w-[180px]">
                        {moment.cafeId?.name}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      {moment.imageUrl && (
                        <div className="w-50 h-auto rounded-lg overflow-hidden border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <img
                            src={moment.imageUrl}
                            alt="Moment"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-amber-800 min-w-xs max-w-xs">
                      {moment.description}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full w-fit">
                        <span className="text-amber-800 font-semibold">
                          {formatCurrencyVND(moment.totalPrice)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-amber-800">
                      <div className="flex flex-col">
                        <span>{formatDateTime(moment.dateTime)}</span>
                        <span className="text-sm text-amber-600">
                          {getTimeOfDay(moment.dateTime)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <button
                          onClick={() => handleViewMoment(moment)}
                          className="p-5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 hover:scale-110"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/update-moment/${moment._id}`)
                          }
                          className="p-5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-110 transition-all"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMoment(moment._id)}
                          className="p-5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-amber-800">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Coffee size={32} className="text-amber-600" />
                      <span>No moments found</span>
                      <button
                        onClick={() => handleResetFilters()}
                        className="text-amber-600 hover:text-amber-800 underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <MomentModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMoment(null);
        }}
        moment={selectedMoment}
      />
    </div>
  );
};

export default MomentManage;
