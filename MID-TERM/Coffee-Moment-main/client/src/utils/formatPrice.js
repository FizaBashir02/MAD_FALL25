// Hàm format số thành dạng nghìn
export const formatPrice = (value) => {
  if (!value) return "";
  const num = parseInt(value.toString().replace(/\D/g, ""), 10);
  return isNaN(num) ? "" : num.toLocaleString("vi-VN");
};
