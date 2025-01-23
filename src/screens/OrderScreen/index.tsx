import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, message, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleApi";
import TableComponent from "../../components/TableComponent";
import { FormModel } from "../../models/FormModel";
import { OrderModel } from "../../models/OrderModel";
import ToggleOrder from "../../modals/ToggleOrder";

const { confirm } = Modal;

const OrderScreen = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);

  const [isVisibleModalAddNewOrder, setIsVisibleModalAddNewOrder] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [orderSelected, setOrderSelected] = useState<OrderModel>();

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState<number>(10);

  const [forms, setForms] = useState<FormModel>();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getOrders();
  }, [page, pageSize]);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getOrders();
      await getForm();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
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

  const removeOrder = async (id: string) => {
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
    res.data && setForms(res.data);
  };

  return (
    <div className="flex flex-col">
      <div className="flex px-4 py-5 rounded-lg h-max mx-8 my-[10px] bg-white flex-col">
        <div className="text-lg font-medium mb-4">Overall Orders</div>
        <div className="flex flex-row justify-between text-gray-600">
          <div className="">
            <div className="text-black text-lg font-medium">Total Orders</div>
            <div className="font-medium">37</div>
            <div>Last 7 days</div>
          </div>
          <div className="border" />
          <div className="">
            <div className="text-[#E19133] text-lg font-medium">
              Total Received
            </div>
            <div className="flex flex-row gap-x-20">
              <div className="flex flex-col text-start">
                <div className="font-medium">32</div>
                <div>Last 7 days</div>
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
              Total Received
            </div>
            <div className="flex flex-row gap-x-20">
              <div className="flex flex-col text-start">
                <div className="font-medium">32</div>
                <div>Last 7 days</div>
              </div>
              <div className="flex flex-col text-end">
                <div className="font-medium">25000</div>
                <div>Revenue</div>
              </div>
            </div>
          </div>
          <div className="border" />
          <div className="">
            <div className="text-[#F36960] text-lg font-medium">On the way</div>
            <div className="flex flex-row gap-x-20">
              <div className="flex flex-col text-start">
                <div className="font-medium">32</div>
                <div>Last 7 days</div>
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
            titleButton="Add Order"
            forms={forms}
            records={orders}
            onPageChange={(val) => {
              setPage(val.page);
              setPageSize(val.pageSize);
            }}
            onCreate={() => {
              setIsVisibleModalAddNewOrder(true);
            }}
            total={total}
            extraColumn={(item) => (
              <Space>
                <Button
                  type="text"
                  onClick={() => {
                    setOrderSelected(item);
                    setIsVisibleModalAddNewOrder(true);
                  }}
                  icon={<EditTwoTone twoToneColor="blue" size={18} />}
                />
                <Button
                  onClick={() =>
                    confirm({
                      title: "Comfirm",
                      content: "Are you sure you want to remove this order?",
                      onOk: () => removeOrder(item._id),
                    })
                  }
                  type="text"
                  icon={<DeleteTwoTone twoToneColor="#F15E2B" size={18} />}
                />
              </Space>
            )}
          />
        )}
        <ToggleOrder
          visible={isVisibleModalAddNewOrder}
          onClose={() => {
            orderSelected && getOrders();
            setOrderSelected(undefined);
            setIsVisibleModalAddNewOrder(false);
          }}
          onAddNew={(val) => setOrders([...orders, val])}
          order={orderSelected}
        />
      </div>
    </div>
  );
};

export default OrderScreen;
