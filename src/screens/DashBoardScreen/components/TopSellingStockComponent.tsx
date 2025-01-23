import StatisticComponent from "../../../components/StatisticComponent";

const TopSellingStockComponent = () => {
  const dataSource = [
    {
      key: "1",
      name: "Surf Excel",
      soldquantity: 32,
      remainingquantity: 10,
      price: 1000,
    },
    {
      key: "2",
      name: "Rin",
      soldquantity: 42,
      remainingquantity: 10,
      price: 1000,
    },
    {
      key: "3",
      name: "Parle G",
      soldquantity: 42,
      remainingquantity: 10,
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
      title: "Sold Quantity",
      dataIndex: "soldquantity",
      key: "age",
    },
    {
      title: "Remaining Quantity",
      dataIndex: "remainingquantity",
      key: "address",
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
        width="w-2/3 max-lg:w-full"
        data={dataSource}
        columns={columns}
        type="table"
        title="Top Selling Stock"
      />
    </>
  );
};

export default TopSellingStockComponent;
