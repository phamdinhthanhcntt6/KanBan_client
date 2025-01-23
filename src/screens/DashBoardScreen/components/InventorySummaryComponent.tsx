import React from "react";
import { icons } from "../../../assets/icon";
import StatisticComponent from "../../../components/StatisticComponent";
import { StatisticModel } from "../../../models/StatisticModel";

const InventorySummaryComponent = () => {
  const inventoryData: StatisticModel[] = [
    {
      key: "sales",
      description: "Quantity in Hand",
      color: "#629FF4",
      icon: icons.quantity,
      value: 832,
      valueTtype: "number",
      type: "horizontal",
    },
    {
      key: "revenue",
      description: "To be received",
      color: "#817AF3",
      icon: icons.received,
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
      title="Inventory Summary"
      width="w-1/3 max-lg:w-full"
    />
  );
};

export default InventorySummaryComponent;
