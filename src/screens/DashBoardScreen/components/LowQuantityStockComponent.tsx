import StatisticComponent from "../../../components/StatisticComponent";

const LowQuantityStockComponent = () => {
  const dataSource = [
    {
      key: "1",
      name: "Surf Excel",
      price: 1000,
    },
    {
      key: "2",
      name: "Rin",
      price: 1000,
    },
    {
      key: "3",
      name: "Parle G",
      price: 1000,
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];
  return (
    <>
      <StatisticComponent
        width="w-1/3 max-lg:w-full"
        data={dataSource}
        columns={columns}
        type="table"
        title="Low Quantity Stock"
      />
    </>
  );
};

export default LowQuantityStockComponent;
