import { icons } from "../../../assets/icon";
import StatisticComponent from "../../../components/StatisticComponent";
import { StatisticModel } from "../../../models/StatisticModel";

const ProductSummaryComponent = () => {
  const inventoryData: StatisticModel[] = [
    {
      key: "sales",
      description: "Number of Suppliers",
      color: "#629FF4",
      icon: icons.sale,
      value: 832,
      valueTtype: "number",
      type: "horizontal",
    },
    {
      key: "revenue",
      description: "Number of Categories",
      color: "#817AF3",
      icon: icons.revenue,
      value: 18300,
      valueTtype: "number",
      type: "horizontal",
    },
  ];
  return (
    <StatisticComponent
      data={inventoryData}
      type="statistic"
      layout="vertical"
      title="Product Summary"
      width="w-1/3  max-lg:w-full"
    />
  );
};

export default ProductSummaryComponent;
