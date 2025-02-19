import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import handleAPI from "../../../apis/handleApi";
import { ProductModel } from "../../../models/ProductModel";
import { SubProductModel } from "../../../models/SubProductModel";
import { Avatar, Button, Empty, message, Modal, Space, Spin, Tag } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { DeleteFilled, EditFilled, PlusCircleFilled } from "@ant-design/icons";
import { SubProductModal } from "../../../modals";

const { confirm } = Modal;

const ProductDetailScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [productDetail, setProductDetail] = useState<ProductModel>();

  const [subProducts, setSubProducts] = useState<SubProductModel[]>([]);

  const [productSelected, setProductSelected] = useState<ProductModel>();

  const [isVisibleModalProduct, setIsVisibleModalProduct] =
    useState<boolean>(false);

  const [subProductSelected, setSubProductSelected] =
    useState<SubProductModel>();

  const [searchParam] = useSearchParams();

  const id = searchParam.get("id");

  useEffect(() => {
    id && getProductDetail();
  }, [id]);

  const getProductDetail = async () => {
    setIsLoading(true);
    try {
      const api = `/product/detail?id=${id}`;
      const res = await handleAPI(api);
      const data = res.data;
      setProductDetail(data.items);
      setSubProducts(data.subProduct);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<SubProductModel>[] = [
    {
      key: "images",
      dataIndex: "images",
      title: "Images",
      render: (images: string[]) => (
        <Space>
          {images &&
            images.length > 0 &&
            images.map((img) => <Avatar src={img} shape="square" size={40} />)}
        </Space>
      ),
    },
    {
      key: "size",
      dataIndex: "size",
      title: "Size",
      render: (size: string) => <Tag>{size}</Tag>,
    },
    {
      key: "color",
      dataIndex: "color",
      title: "Color",
      render: (color: string) => <Tag color={color}>{color}</Tag>,
    },
    {
      key: "price",
      dataIndex: "price",
      title: "Price",
      align: "right",
      render: (price: number) => <>{price}</>,
    },
    {
      key: "quantity",
      dataIndex: "quantity",
      title: "Stock",
      align: "right",
      render: (quantity: number) => <>{quantity}</>,
    },
    {
      key: "actions",
      dataIndex: "",
      fixed: "right",
      align: "right",
      render: (item: SubProductModel) => (
        <Space>
          <Button
            icon={<EditFilled />}
            type="primary"
            onClick={() => {
              setSubProductSelected(item);
              setIsVisibleModalProduct(true);
              setProductSelected(productDetail);
            }}
          />
          <Button
            icon={<DeleteFilled />}
            danger
            onClick={() => {
              confirm({
                title: "Confirm",
                content: "Are you sure you want to remove this sub product?",
                onOk: () => handleRemove(item._id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const handleRemove = async (id: string) => {
    const api = `/sub-product/remove?id=${id}`;
    await handleAPI(api, undefined, "delete");
    const items = [...subProducts];
    const index = items.findIndex((e) => e._id === id);

    index !== -1 && items.splice(index, 1);

    setSubProducts(items);

    message.success("Remove sub product successfully!");
  };

  return (
    <div className="flex px-4 py-5 rounded-lg h-max mx-8 my-[10px] bg-white">
      {isLoading ? (
        <Spin />
      ) : productDetail ? (
        <div className="flex flex-col w-full">
          <div className="font-medium text-xl px-6">{productDetail?.title}</div>
          <div className="mt-1 w-full px-6">
            <Table
              columns={columns}
              dataSource={subProducts}
              className="w-full"
              title={() => (
                <div className="w-full flex justify-end">
                  <Button
                    type="dashed"
                    onClick={() => {
                      setProductSelected(productDetail);
                      setIsVisibleModalProduct(true);
                    }}
                    icon={<PlusCircleFilled />}
                  >
                    Create sub product
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      ) : (
        <div className="flex w-full">
          <Empty description="Data not found" className="mx-auto" />
        </div>
      )}
      <SubProductModal
        isVisible={isVisibleModalProduct}
        onClose={() => {
          setProductSelected(undefined);
          setIsVisibleModalProduct(false);
          setSubProductSelected(undefined);
        }}
        subProduct={subProductSelected}
        onOK={async () => {
          await getProductDetail();
        }}
        product={productSelected}
      />
    </div>
  );
};

export default ProductDetailScreen;
