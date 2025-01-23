export const formatNumber = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export class formatCurrency {
  static VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
