import { Button, message, Modal, Space, Spin } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import handleAPI from "../../apis/handleApi";
import { CategoryModal } from "../../modals";
import { CategoryModel } from "../../models/CategoryModel";
import { getTreeData } from "../../utils/getTreeData";
import { DeleteOutlined, EditFilled } from "@ant-design/icons";

const { confirm } = Modal;

const CategoryScreen = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const [categories, setCategories] = useState<CategoryModel[]>([]);

  const [categorySelected, setCategorySelected] = useState<string>("");

  const [categoryOption, setCategoryOption] = useState<any[]>([]);

  useEffect(() => {
    const api = `/category`;
    getCategories(api, true);
  }, []);

  const getCategories = async (api: string, isSelect?: boolean) => {
    try {
      const res = await handleAPI(api);
      setCategories(getTreeData(res.data, false));
      isSelect && setCategoryOption(getTreeData(res.data, true));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCategory = async (id: string) => {
    try {
      const api = `/category/remove?id=${id}`;
      await handleAPI(api, undefined, "delete");
      await getCategories(`/category`);
      message.success("Remove category successfully!");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns: ColumnProps<CategoryModel>[] = [
    {
      key: "title",
      title: "Title",
      dataIndex: "",
      render: (item: CategoryModel) => (
        <Link
          to={`/category/detail/${item.slug}?id=${item._id}`}
          className={`font-medium ${item.parentId === "" && `text-[#F15E2B]`}`}
        >
          {item.title}
        </Link>
      ),
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "btnContainer",
      title: "Actions",
      dataIndex: "",
      align: "right",
      render: (item: any) => (
        <Space>
          <Button
            icon={<EditFilled />}
            onClick={() => {
              setIsVisible(true);
              setCategorySelected(item.key);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              confirm({
                title: "Confirm",
                content: "Remove this category?",
                onOk: () => removeCategory(item._id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return isLoading ? (
    <Spin />
  ) : (
    <div className="mt-[10px] bg-white mx-8 rounded-lg h-max w-1/2">
      <Table
        dataSource={categories}
        columns={columns}
        size="middle"
        title={() => (
          <div className="w-full flex justify-end">
            <Button onClick={() => setIsVisible(true)} className="">
              Create category
            </Button>
          </div>
        )}
      />
      <CategoryModal
        visible={isVisible}
        onClose={() => {
          const api = `/category`;
          categorySelected && getCategories(api, true);
          setCategorySelected("");
          setIsVisible(false);
        }}
        onFinish={() => {
          const api = `/category`;
          getCategories(api, true);
        }}
        values={categoryOption}
        category={categorySelected}
      />
    </div>
  );
};

export default CategoryScreen;
