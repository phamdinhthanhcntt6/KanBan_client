import { DeleteTwoTone, EditTwoTone, EyeOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleApi";
import TableComponent from "../../components/TableComponent";
import CategoryModal from "../../modals/CategoryModal";
import { CategoryModel } from "../../models/CategoryModel";
import { FormModel, TreeModel } from "../../models/FormModel";
import { getTreeData } from "../../utils/getTreeData";

const { confirm } = Modal;

const CategoryScreen = () => {
  const [isVisibleCategoryModal, setIsVisibleCategoryModal] = useState(false);

  const [categoryOption, setCategoryOption] = useState<TreeModel[]>([]);

  const [categories, setCategories] = useState<CategoryModel[]>([]);

  const [categorySelected, setCategorySelected] = useState<CategoryModel>();

  const [forms, setForms] = useState<FormModel>();

  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState<number>(10);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getCategoryList();
  }, [page, pageSize]);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getForm();
      await getCategoryList();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryList = async () => {
    const api = `/category?page=${page}&pageSize=${pageSize}`;
    const res = await handleAPI(api);
    const data = res.data.items;

    const items: CategoryModel[] = [];

    res.data.items.forEach((item: any, index: number) =>
      items.push({
        index: (page - 1) * pageSize + index + 1,
        ...item,
      })
    );

    setCategories(items);
    setTotal(res.data.total);
    const value = data.length > 0 ? getTreeData(data) : [];
    setCategoryOption(value);
    setCategories(getTreeData(data, true));
  };

  const getForm = async () => {
    const api = `/category/get-form`;
    const res = await handleAPI(api);
    res.data && setForms(res.data);
  };

  const removeCategory = async (id: string) => {
    try {
      const api = `/category/remove?id=${id}`;
      await handleAPI(api, undefined, "delete");
      await getCategoryList();
      message.success("Remove category successfully!");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return isLoading ? (
    <Spin />
  ) : (
    <div className="mt-[10px] bg-white mx-8 rounded-lg h-max w-1/2">
      {forms && (
        <TableComponent
          size="small"
          forms={forms}
          records={categories}
          loading={isLoading}
          onPageChange={(val) => {
            setPage(val.page);
            setPageSize(val.pageSize);
          }}
          onCreate={() => {
            setIsVisibleCategoryModal(true);
          }}
          total={total}
          api={"/category"}
          titleButton="Add Category"
          extraColumn={(item: CategoryModel) => (
            <Space>
              <Button
                type="text"
                onClick={() => {
                  window.location.href = `/category/detail?id=${item._id}&name=${item.slug}`;
                }}
                icon={<EyeOutlined className="border-none" />}
              />
              <Button
                type="text"
                onClick={() => {
                  setCategorySelected(item);
                  setIsVisibleCategoryModal(true);
                }}
                icon={<EditTwoTone twoToneColor="blue" size={18} />}
              />
              <Button
                onClick={() =>
                  confirm({
                    title: "Comfirm",
                    content: "Are you sure you want to remove this category?",
                    onOk: () => removeCategory(item._id),
                  })
                }
                type="text"
                icon={<DeleteTwoTone twoToneColor="#F15E2B" size={18} />}
              />
            </Space>
          )}
        />
      )}
      <CategoryModal
        visible={isVisibleCategoryModal}
        onClose={() => {
          categorySelected && getCategoryList();
          setCategorySelected(undefined);
          setIsVisibleCategoryModal(false);
        }}
        onFinish={() => {
          getCategoryList();
        }}
        values={categoryOption}
        category={categorySelected}
      />
    </div>
  );
};

export default CategoryScreen;
