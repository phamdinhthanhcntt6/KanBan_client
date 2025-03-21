import {
  ColorPicker,
  Form,
  GetProp,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleApi";
import { ProductModel } from "../models/ProductModel";
import { SubProductModel } from "../models/SubProductModel";
import { getBase64 } from "../utils/getBase64";
import { uploadFile } from "../utils/uploadFile";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  product?: ProductModel;
  onOK: (val: SubProductModel) => void;
  subProduct?: SubProductModel;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const SubProductModal = (props: Props) => {
  const { isVisible, onClose, product, onOK, subProduct } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [fileList, setFileList] = useState<any[]>([]);

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const [previewImage, setPreviewImage] = useState("");

  const [form] = useForm();

  useEffect(() => {
    if (subProduct) {
      form.setFieldsValue(subProduct);
      const items = [...fileList];
      subProduct.images.length > 0 &&
        subProduct.images.forEach((url: string) =>
          items.push({
            uid: `image_${Date.now().toString()}`,
            name: url,
            status: "done",
            url,
          })
        );

      setFileList(items);
    }
  }, [subProduct]);

  const handleCreateSubProduct = async (values: any) => {
    if (product) {
      const data: any = {};

      for (const i in values) {
        data[i] = values[i] ?? "";
      }

      data.productId = product?._id;

      if (fileList.length > 0) {
        const urls: string[] = [];

        for (const file of fileList) {
          if (file.originFileObj) {
            const url = await uploadFile(file.originFileObj);
            url && urls.push(url);
          } else {
            urls.push(file.url);
          }
        }

        data.images = urls;
      }

      if (data.color) {
        data.color =
          typeof data.color === "string"
            ? data.color
            : data.color.toHexString();
      }

      setIsLoading(true);
      try {
        const method = subProduct ? "put" : "post";
        const api = `/sub-product/${
          subProduct ? `update?id=${subProduct._id}` : "create"
        }`;
        const res = await handleAPI(api, data, method);
        onOK(res.data);
        handleCancel();
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
      onClose();
    } else {
      message.error("Product doesn't exist");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <Modal
      title={`${subProduct ? "Update sub product" : "Create sub product"}`}
      open={isVisible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okButtonProps={{
        loading: isLoading,
      }}
      onClose={handleCancel}
    >
      <span className="flex flex-row text-lg text-[#F15E2B] flex-wrap">
        Product name:&nbsp;
        <div className="font-semibold text-[#000000e0]">{product?.title}</div>
      </span>
      <Form
        onFinish={handleCreateSubProduct}
        layout="vertical"
        form={form}
        disabled={isLoading}
      >
        <Form.Item
          name="color"
          label="Color"
          rules={[
            {
              required: true,
              message: "Choose color",
            },
          ]}
        >
          <ColorPicker format="hex" />
        </Form.Item>
        <div className="flex flex-row w-full justify-between gap-x-4">
          <Form.Item
            name="size"
            label="Size"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Enter the size",
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Enter quantity",
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
        <div className="flex flex-row w-full justify-between gap-x-4">
          <Form.Item
            name="discount"
            label="Discount"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Enter discount",
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Enter price",
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
      </Form>
      <Upload
        name="images"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple
        accept="image/*"
      >
        Upload
      </Upload>
      <>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </>
    </Modal>
  );
};

export default SubProductModal;
