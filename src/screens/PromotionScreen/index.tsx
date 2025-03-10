import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Button, message, Modal, Space, Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleApi";
import { PromotionModal } from "../../modals";
import { PromotionModel } from "../../models/PromotionModel";

const { confirm } = Modal;

const PromotionScreen = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [page, _setPage] = useState<number>(1);

  const [pageSize, _setPageSize] = useState<number>(10);

  const [promotions, setPromotions] = useState<PromotionModel[]>([]);

  const [promotionSelected, setPromotionSelected] = useState<PromotionModel>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getPromoptions();
  }, []);

  const getPromoptions = async () => {
    setIsLoading(true);
    try {
      const api = `/promotion?page=${page}&pageSize=${pageSize}`;
      const res = await handleAPI(api);
      setPromotions(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removePromotion = async (id: string) => {
    try {
      setIsLoading(true);
      const api = `/promotion/remove?id=${id}`;
      await handleAPI(api, undefined, "delete");

      const items = [...promotions];
      const index = items.findIndex((e) => e._id === id);

      index !== -1 && items.splice(index, 1);

      setPromotions(items);

      message.success("Remove!");
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<PromotionModel>[] = [
    {
      key: "title",
      dataIndex: "",
      title: "Title",
      fixed: "left",
      render: (i: PromotionModel) => <>{i.title}</>,
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Description",
    },
    {
      key: "code",
      dataIndex: "code",
      title: "Code",
    },
    {
      key: "value",
      dataIndex: "value",
      title: "Value",
    },
    {
      key: "numOfAvailable",
      dataIndex: "numOfAvailable",
      title: "Num Of Available",
    },
    {
      key: "type",
      dataIndex: "type",
      title: "Type",
    },
    {
      key: "action",
      title: "",
      dataIndex: "",
      align: "right",
      render: (item: PromotionModel) => (
        <Space>
          <Button
            icon={<EditFilled />}
            onClick={() => {
              setIsVisible(true);
              setPromotionSelected(item);
            }}
          />
          <Button
            icon={<DeleteFilled />}
            onClick={() => {
              confirm({
                title: "Confirm",
                content: "Remove this promotion?",
                onOk: () => removePromotion(item._id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) return <></>;

  return (
    <div className="flex px-4 py-2 rounded-lg h-max mx-8 my-1 bg-white flex-col">
      <div className="flex justify-between mb-4">
        <div className="text-xl font-medium">Promotion</div>
        <Button
          type="primary"
          className="h-max"
          onClick={() => {
            setIsVisible(true);
          }}
        >
          Create promotion
        </Button>
      </div>
      <Table dataSource={promotions} columns={columns} size="middle" />
      <PromotionModal
        visible={isVisible}
        onClose={() => {
          setIsVisible(false);
          setPromotionSelected(undefined);
        }}
        onFinish={async () => {
          await getPromoptions();
        }}
        promotion={promotionSelected}
      />
    </div>
  );
};

export default PromotionScreen;
