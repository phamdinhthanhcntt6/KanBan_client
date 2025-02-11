import { PlusCircleTwoTone } from "@ant-design/icons";
import { Avatar, Button, message, Space } from "antd";
import { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleApi";
import CategoryNameComponent from "../../components/CategoryNameComponent";
import TableComponent from "../../components/TableComponent";
import { SubProductModal } from "../../modals";
import { ProductModel } from "../../models/ProductModel";

const InventoryScreen = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);

  const [isVisibleModalProduct, setIsVisibleModalProduct] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [productSelected, setProductSelected] = useState<ProductModel>();

  const [page, setPage] = useState<number>(1);

  const [pageSize, setPageSize] = useState<number>(10);

  const [total, setTotal] = useState<number>(10);

  const [categoryQuantity, setCategoryQuantity] = useState<number>(0);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getProducts();
  }, [page, pageSize]);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getProducts();
      await getCategoryList();
      await getProducts();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryList = async () => {
    const api = `/category`;
    const res = await handleAPI(api);
    const quantity = res.data.items.length;
    setCategoryQuantity(quantity);
  };

  const getProducts = async () => {
    const api = `/product?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      res.data && setProducts(res.data.items);

      const items: ProductModel[] = [];

      res.data.items.forEach((item: any, index: number) =>
        items.push({
          index: (page - 1) * pageSize + index + 1,
          ...item,
        })
      );
      setProducts(items);
      setTotal(res.data.total);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await handleAPI(`product/remove?id=${id}`, undefined, "delete");
      getProducts();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns: ColumnProps<ProductModel>[] = [
    {
      key: "title",
      dataIndex: "title",
      title: "Title",
      fixed: "left",
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Description",
    },
    {
      key: "categories",
      dataIndex: "categories",
      title: "Categories",
      render: (categories: string[]) => (
        <div className="flex-wrap">
          {categories.map((item: any, index) => (
            <CategoryNameComponent id={item} key={index} />
          ))}
        </div>
      ),
    },
    {
      key: "supplier",
      dataIndex: "supplier",
      title: "Supplier",
    },
    {
      key: "images",
      dataIndex: "images",
      title: "Images",
      render: (image: string[]) =>
        image &&
        image.length > 0 && (
          <Space>
            <Avatar.Group shape="square">
              {image.map((item, index) => (
                <Avatar src={item} key={index} size={50} />
              ))}
            </Avatar.Group>
          </Space>
        ),
    },
    {
      key: "action",
      title: "",
      dataIndex: "",
      width: 50,
      align: "center",
      fixed: "right",
      render: (item: ProductModel) => (
        <Space className="w-max flex flex-row">
          <Button
            type="text"
            onClick={() => {
              setProductSelected(item);
              setIsVisibleModalProduct(true);
            }}
          >
            <PlusCircleTwoTone />
          </Button>
        </Space>
      ),
    },
  ];

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
                <div className="font-medium">{products.length}</div>
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
        <TableComponent
          api="/product"
          loading={isLoading}
          size="small"
          column={columns}
          records={products}
          onPageChange={(val) => {
            setPage(val.page);
            setPageSize(val.pageSize);
          }}
          titleButton="Add Product"
          onCreate={() => {
            window.location.href = "/inventory/create-product";
          }}
          total={total}
        />
      </div>
      <SubProductModal
        isVisible={isVisibleModalProduct}
        onClose={() => {
          setProductSelected(undefined);
          setIsVisibleModalProduct(false);
        }}
        product={productSelected}
      />
    </div>
  );
};

export default InventoryScreen;
