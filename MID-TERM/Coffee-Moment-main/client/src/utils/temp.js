{
  /* Table */
}
<div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-amber-100">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-amber-100">
      <thead className="bg-gradient-to-r from-amber-600 to-amber-800">
        <tr>
          <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
            Quán Cafe
          </th>
          <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
            Hình ảnh
          </th>
          <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
            Mô tả
          </th>
          <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
            Tổng giá
          </th>
          <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
            Thời gian
          </th>
          <th className="px-4 md:px-6 py-3 text-right text-xs md:text-sm font-semibold text-amber-50 uppercase tracking-wider">
            Hành động
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
                    className="p-1 md:p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 hover:scale-110"
                    title="Xem chi tiết"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => navigate(`/update-moment/${moment._id}`)}
                    className="p-1 md:p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-110 transition-all"
                    title="Sửa"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteMoment(moment._id)}
                    className="p-1 md:p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all"
                    title="Xóa"
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
                <span>Không tìm thấy moment nào</span>
                <button
                  onClick={() => {
                    resetFilters();
                    setSearchQuery("");
                  }}
                  className="text-amber-600 hover:text-amber-800 underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>;

{
  /* Pagination */
}
{
  pagination.totalPages > 1 && renderPagination();
}

{
  /* Modal */
}
<MomentModal
  open={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setSelectedMoment(null);
  }}
  moment={selectedMoment}
/>;
