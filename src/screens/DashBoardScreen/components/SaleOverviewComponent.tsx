import { icons } from "../../../assets/icon";
import StatisticComponent from "../../../components/StatisticComponent";
import { StatisticModel } from "../../../models/StatisticModel";

const SaleOverviewComponent = () => {
  const saleData: StatisticModel[] = [
    {
      key: "sales",
      description: "Sales",
      color: "#629FF4",
      icon: icons.sale,
      value: 832,
      valueTtype: "currency",
      type: "horizontal",
    },
    {
      key: "revenue",
      description: "Revenue",
      color: "#817AF3",
      icon: icons.revenue,
      value: 18300,
      valueTtype: "currency",
      type: "horizontal",
    },
    {
      key: "profit",
      description: "Profit",
      color: "#DBA362 ",
      icon: icons.profit,
      value: 868,
      valueTtype: "currency",
      type: "horizontal",
    },
    {
      key: "cost",
      description: "Cost",
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
      title="Sales Overview"
      width="w-2/3 max-lg:w-full"
    />
  );
};

export default SaleOverviewComponent;
