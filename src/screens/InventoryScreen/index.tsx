import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, message, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleApi";
import TableComponent from "../../components/TableComponent";
import { FormModel } from "../../models/FormModel";
import { OrderModel } from "../../models/OrderModel";
import ToggleProduct from "../../modals/ToggleProduct";

const { confirm } = Modal;

const InventoryScreen = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);

  const [isVisibleModalProduct, setIsVisibleModalProduct] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [orderSelected, setOrderSelected] = useState<OrderModel>();

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState<number>(10);

  const [forms, setForms] = useState<FormModel>();

  const [categoryQuantity, setCategoryQuantity] = useState<number>(0);

  useEffect(() => {
    getData();
    getProductForm();
  }, []);

  useEffect(() => {
    getOrders();
  }, [page, pageSize]);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getCategoryList();
      await getOrders();
      await getForm();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryList = async () => {
    const api = `/category`;
    const res = await handleAPI(api);
    const data = res.data.items.length;
    setCategoryQuantity(data);
  };

  const getOrders = async () => {
    const api = `/order?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      res.data && setOrders(res.data.items);

      const items: OrderModel[] = [];

      res.data.items.forEach((item: any, index: number) =>
        items.push({
          index: (page - 1) * pageSize + index + 1,
          ...item,
        })
      );
      setOrders(items);
      setTotal(res.data.total);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await handleAPI(`order/remove?id=${id}`, undefined, "delete");
      getOrders();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getForm = async () => {
    const api = `/order/get-form`;
    const res = await handleAPI(api);
    // res.data && setForms(res.data);
  };

  const getProductForm = async () => {
    const api = `/product/get-form`;
    const res = await handleAPI(api);
    res.data && setForms(res.data);
  };

  return (
    <div className="flex flex-col">
      <div className="flex px-4 py-5 rounded-lg h-max mx-8 my-[10px] bg-white flex-col">
        <div className="text-lg font-medium mb-4">Overall Inventory</div>
        <div className="flex flex-row justify-between text-gray-600">
          <div className="">
            <div className="text-[#F15E2B] text-lg font-medium ">
              Categories
            </div>
            <div className="font-medium">{categoryQuantity ?? 0}</div>
            <div className="font-normal">Last 7 days</div>
          </div>
          <div className="border" />
          <div className="">
            <div className="text-[#E19133] text-lg font-medium">
              Total Products
            </div>
            <div className="flex flex-row gap-x-20">
              <div className="flex flex-col text-start">
                <div className="font-medium">32</div>
                <div className="font-normal">Last 7 days</div>
              </div>
              <div className="flex flex-col text-end">
                <div className="font-medium">25000</div>
                <div>Revenue</div>
              </div>
            </div>
          </div>
          <div className="border" />
          <div className="">
            <div className="text-[#845EBC] text-lg font-medium">
              Top Selling
            </div>
            <div className="flex flex-row gap-x-20">
              <div className="flex flex-col text-start">
                <div className="font-medium">32</div>
                <div className="font-normal">Last 7 days</div>
              </div>
              <div className="flex flex-col text-end">
                <div className="font-medium">25000</div>
                <div>Revenue</div>
              </div>
            </div>
          </div>
          <div className="border" />
          <div className="">
            <div className="text-[#F36960] text-lg font-medium">Low stocks</div>
            <div className="flex flex-row gap-x-20">
              <div className="flex flex-col text-start">
                <div className="font-medium">32</div>
                <div className="font-normal">Last 7 days</div>
              </div>
              <div className="flex flex-col text-end">
                <div className="font-medium">25000</div>
                <div>Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[10px] bg-white mx-8 rounded-lg h-max">
        {forms && (
          <TableComponent
            api="/order"
            loading={isLoading}
            size="small"
            forms={forms}
            records={orders}
            onPageChange={(val) => {
              setPage(val.page);
              setPageSize(val.pageSize);
            }}
            titleButton="Add Product"
            onCreate={() => {
              window.location.href = "/inventory/create-product";
            }}
            total={total}
            extraColumn={(item) => (
              <Space>
                <Button
                  type="text"
                  onClick={() => {
                    setOrderSelected(item);
                    setIsVisibleModalProduct(true);
                  }}
                  icon={<EditTwoTone twoToneColor="blue" size={18} />}
                />
                <Button
                  onClick={() =>
                    confirm({
                      title: "Comfirm",
                      content: "Are you sure you want to remove this product?",
                      onOk: () => removeProduct(item._id),
                    })
                  }
                  type="text"
                  icon={<DeleteTwoTone twoToneColor="#F15E2B" size={18} />}
                />
              </Space>
            )}
          />
        )}
        <ToggleProduct
          visible={isVisibleModalProduct}
          onClose={() => {
            setIsVisibleModalProduct(false);
          }}
        />
      </div>
    </div>
  );
};

export default InventoryScreen;
