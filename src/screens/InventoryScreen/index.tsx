import {
  ClearOutlined,
  DeleteTwoTone,
  EditTwoTone,
  FilterOutlined,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  message,
  Modal,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { ColumnProps, TableProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import handleAPI from "../../apis/handleApi";
import DisplayNameComponent from "../../components/DisplayNameComponent";
import FilterComponent from "../../components/FilterComponent";
import TableComponent from "../../components/TableComponent";
import { SubProductModal } from "../../modals";
import { FilterModel } from "../../models/FilterModel";
import { ProductModel } from "../../models/ProductModel";
import { SubProductModel } from "../../models/SubProductModel";
import { replaceName } from "../../utils/replaceName";
import { truncated } from "../../utils/truncatedText";

const { confirm } = Modal;

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

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

  const [productQuantity, setProductQuantity] = useState<number>(0);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [searchKey, setSearchKey] = useState<string>("");

  const [isFilter, setIsFilter] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getProducts();
  }, [page, pageSize]);

  useEffect(() => {
    !searchKey && getProducts();
  }, [searchKey]);

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
    const api = `/product?title=${replaceName(
      searchKey
    )}&page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);

      setProductQuantity(res.data.total);

      const items: ProductModel[] = [];

      res.data.items.forEach((item: any, index: number) =>
        items.push({
          key: `${item._id}`,
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

      const items = [...products];
      const index = items.findIndex((element) => element._id === id);

      index !== -1 && items.splice(index, 1);

      setProducts(items);

      message.success("Delete product successfully!");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getRangePrice = (data: SubProductModel[]) => {
    const ranges: number[] = [];

    data.length > 0 && data.forEach((item) => ranges.push(item.price));

    return data.length > 0
      ? ranges.length > 1
        ? `${Math.min(...ranges)} - ${Math.max(...ranges)}`
        : `${ranges[0]}`
      : "0";
  };

  const columns: ColumnProps<ProductModel>[] = [
    {
      key: "title",
      dataIndex: "",
      title: "Title",
      fixed: "left",
      render: (product: ProductModel) => (
        <Link to={`/inventory/detail/${product.slug}?id=${product._id}`}>
          <Tooltip title={product.title}>
            <Button type="link">{truncated(product.title)}</Button>
          </Tooltip>
        </Link>
      ),
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Description",
      render: (description: string) => (
        <Tooltip title={description}>
          <div className="line-clamp-2">{truncated(description, 40)}</div>
        </Tooltip>
      ),
    },
    {
      key: "categories",
      dataIndex: "categories",
      title: "Categories",
      render: (categories: string[]) => (
        <div className="flex-wrap">
          {categories &&
            categories.map((item: any, index: number) => (
              <DisplayNameComponent id={item} type="category" key={index} />
            ))}
        </div>
      ),
    },
    {
      key: "supplier",
      dataIndex: "supplier",
      title: "Supplier",
      render: (id: string) => <DisplayNameComponent type="supplier" id={id} />,
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
              {image.map((item, index: number) => (
                <>
                  <Avatar src={item} key={index} size={50} />
                </>
              ))}
            </Avatar.Group>
          </Space>
        ),
    },
    {
      key: "color",
      dataIndex: "subItems",
      title: "Color",
      render: (items: SubProductModel[]) => {
        const colors: string[] = [];

        items.forEach(
          (item) => !colors.includes(item.color) && colors.push(item.color)
        );
        const length = colors.length;
        return (
          <Space>
            {colors.length > 0 &&
              colors.splice(0, 3).map((item, index: number) => (
                <div
                  className="rounded-full h-6 w-6"
                  key={`color${index}`}
                  style={{
                    background: item,
                  }}
                />
              ))}
            <>
              {length > 3 && (
                <div className="rounded-full h-6 w-6 border">+{length - 3}</div>
              )}
            </>
          </Space>
        );
      },
    },
    {
      key: "size",
      dataIndex: "subItems",
      title: "Size",
      render: (items: SubProductModel[]) => {
        const uniqueSizes = Array.from(new Set(items.map((item) => item.size)));

        return (
          <Space className="flex-wrap">
            {uniqueSizes.length > 0 &&
              uniqueSizes.map((size, index) => (
                <Tag key={`${size}-${index}`}>{size}</Tag>
              ))}
          </Space>
        );
      },
    },
    {
      key: "price",
      dataIndex: "subItems",
      title: "Price",
      render: (items: SubProductModel[]) => <>{getRangePrice(items)}</>,
    },
    {
      key: "stocks",
      dataIndex: "subItems",
      title: "Stocks",
      render: (items: SubProductModel[]) => (
        <>{items.reduce((a, b) => a + b.quantity, 0)}</>
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
        <Space className="w-max flex flex-row" key={item._id}>
          <Tooltip key={"buttonCreate"} title="Create sub product">
            <Button
              type="text"
              onClick={() => {
                setProductSelected(item);
                setIsVisibleModalProduct(true);
              }}
            >
              <PlusCircleTwoTone />
            </Button>
          </Tooltip>
          <Tooltip key={"buttonUpdate"} title="Update product">
            <Button
              type="text"
              onClick={() => {
                navigate(`/inventory/create-product?id=${item._id}`);
              }}
            >
              <EditTwoTone twoToneColor="blue" />
            </Button>
          </Tooltip>
          <Tooltip key={"buttonRemove"} title="Remove product">
            <Button
              type="text"
              onClick={() => {
                confirm({
                  title: "Confirm",
                  content: "Are you sure you want to remove this product?",
                  onOk: () => removeProduct(item._id),
                });
              }}
            >
              <DeleteTwoTone twoToneColor="#F15E2B" />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<ProductModel> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const renderExtraHeader = () => {
    return (
      <div className="flex flex-row items-center gap-x-4">
        <>
          <Dropdown
            dropdownRender={() => (
              <FilterComponent onFilter={(val) => handleFilter(val)} />
            )}
          >
            <Button icon={<FilterOutlined />} type="dashed">
              Filter
            </Button>
          </Dropdown>
          {isFilter && (
            <Button
              icon={<ClearOutlined />}
              onClick={async () => {
                setPage(1);
                await getProducts();
                setIsFilter(false);
              }}
              type="dashed"
            >
              Clear
            </Button>
          )}
          <Input.Search
            allowClear
            value={searchKey}
            onChange={(val) => setSearchKey(val.target.value)}
            onSearch={handleSearch}
            placeholder="Search"
          />
        </>
        {selectedRowKeys.length > 0 && (
          <div className="w-max flex items-center gap-x-4">
            <div className="w-max flex-nowrap">
              {selectedRowKeys.length} item(s) selected
            </div>
            <Button
              onClick={() =>
                confirm({
                  title: "Confirm",
                  content: "Are you sure you want to remove these products?",
                  onOk: () => {
                    selectedRowKeys.forEach(
                      async (key: any) => await removeProduct(key)
                    );
                  },
                })
              }
            >
              <DeleteTwoTone twoToneColor="#F15E2B" size={18} />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderOverallInventory = () => {
    return (
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
                <div className="font-medium">{productQuantity ?? 0}</div>
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
    );
  };

  const handleSearch = async () => {
    setPage(1);

    const searchText = replaceName(searchKey);
    const api = `/product?title=${searchText}&page=${page}&pageSize=${pageSize}`;

    try {
      setIsLoading(true);

      const res = await handleAPI(api);
      setProducts(res.data.items);

      const count = res.data.count.length;
      setTotal(count);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async (values: FilterModel) => {
    const api = `/product/filter`;
    setIsFilter(true);
    try {
      const res = await handleAPI(api, values, "post");
      setTotal(res.data.total);
      setProducts(res.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      {renderOverallInventory()}
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
            navigate("/inventory/create-product");
          }}
          total={total}
          rowSelectionTable={rowSelection}
          extraHeader={renderExtraHeader()}
        />
      </div>
      <SubProductModal
        isVisible={isVisibleModalProduct}
        onClose={() => {
          setProductSelected(undefined);
          setIsVisibleModalProduct(false);
        }}
        onCreate={async () => {
          await getProducts();
        }}
        product={productSelected}
      />
    </div>
  );
};

export default InventoryScreen;
