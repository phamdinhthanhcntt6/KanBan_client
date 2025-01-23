import { icons } from "../../../assets/icon";
import StatisticComponent from "../../../components/StatisticComponent";
import { StatisticModel } from "../../../models/StatisticModel";

const PurchaseOverviewComponent = () => {
  const saleData: StatisticModel[] = [
    {
      key: "sales",
      description: "Purchase",
      color: "#629FF4",
      icon: icons.sale,
      value: 82,
      valueTtype: "number",
      type: "horizontal",
    },
    {
      key: "revenue",
      description: "Cost",
      color: "#817AF3",
      icon: icons.cost,
      value: 13573,
      valueTtype: "currency",
      type: "horizontal",
    },
    {
      key: "profit",
      description: "Cancel",
      color: "#DBA362 ",
      icon: icons.profit,
      value: 5,
      valueTtype: "number",
      type: "horizontal",
    },
    {
      key: "cost",
      description: "Return",
      color: "#58D365",
      icon: icons.cost,
      value: 17432,
      valueTtype: "currency",
      type: "horizontal",
    },
  ];
  return (
    <StatisticComponent
      data={saleData}
      type="statistic"
      layout="horizontal"
      title="Purchase Overview"
      width="w-2/3 max-lg:w-full"
    />
  );
};

export default PurchaseOverviewComponent;
