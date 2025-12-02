export const formatCurrencyVND = (amount) => {
  if (typeof amount !== "number") {
    amount = Number(amount);
  }
  if (isNaN(amount)) return "0 VNĐ";

  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
