import {
  DatePicker,
  Form,
  GetProp,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleApi";
import { PromotionModel } from "../models/PromotionModel";
import { getBase64 } from "../utils/getBase64";
import { uploadFile } from "../utils/uploadFile";
import dayjs from "dayjs";

interface Props {
  visible: boolean;
  promotion?: PromotionModel;
  onClose: () => void;
  onFinish: () => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const PromotionModal = (props: Props) => {
  const { visible, promotion, onClose, onFinish } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [fileList, setFileList] = useState<any[]>([]);

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const [previewImage, setPreviewImage] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    if (promotion) {
      const formattedPromotion = {
        ...promotion,
        startAt: dayjs(promotion.startAt),
        endAt: dayjs(promotion.endAt),
      };

      form.setFieldsValue(formattedPromotion);

      const items = [...fileList];
      promotion.images &&
        promotion.images.length > 0 &&
        promotion.images.forEach((url: string) =>
          items.push({
            uid: `image_${Date.now().toString()}`,
            name: url,
            status: "done",
            url,
          })
        );

      setFileList(items);
    }
  }, [promotion]);

  const handleCancel = () => {
    onClose();
    setFileList([]);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    const data: any = {};

    for (const i in values) {
      data[i] = values[i] ?? "";
    }

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

    const startAt = values.startAt;
    const endAt = values.endAt;

    if (!startAt || !endAt) {
      message.error("Please select both start and end dates.");
      return;
    }

    data.startAt = startAt.toDate();
    data.endAt = endAt.toDate();

    if (new Date(endAt).getTime() < new Date(startAt).getTime()) {
      message.error("The start time must be earlier than the end time.");
      return;
    }

    try {
      setIsLoading(true);
      const api = `/promotion/${
        promotion ? `update?id=${promotion._id}` : "create"
      }`;
      const method = promotion ? "put" : "post";
      await handleAPI(api, data, method);
      handleCancel();
      onFinish();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
      open={visible}
      title={promotion ? "Update promotion" : "Create promotion"}
      onCancel={handleCancel}
      closable={isLoading}
      onClose={handleCancel}
      onOk={() => form.submit()}
      okText={promotion ? "Update" : "Create"}
      okButtonProps={{
        loading: isLoading,
        disabled: isLoading,
      }}
      cancelButtonProps={{ loading: isLoading, disabled: isLoading }}
    >
      <Upload
        fileList={fileList}
        listType="picture-card"
        onChange={handleChange}
        onPreview={handlePreview}
        accept="image/*"
      >
        Upload
      </Upload>
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
      <Form
        form={form}
        layout="vertical"
        size="middle"
        onFinish={handleSubmit}
        disabled={isLoading}
      >
        <Form.Item
          name={"title"}
          label="Title"
          rules={[
            {
              required: true,
              message: "Enter title",
            },
          ]}
        >
          <Input placeholder="Title" allowClear />
        </Form.Item>
        <Form.Item name={"description"} label="Description">
          <Input.TextArea rows={3} placeholder="Description" allowClear />
        </Form.Item>
        <div className="flex gap-x-4">
          <Form.Item
            name={"code"}
            label="Code"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Enter code",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"value"}
            label="Value"
            className="w-full"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
        <div className="flex gap-x-4">
          <Form.Item
            name={"numOfAvailable"}
            label="Num of available"
            className="w-full"
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name={"type"} label="Type" className="w-full">
            <Select
              options={[
                {
                  label: "Discount",
                  value: "discount",
                },
                {
                  label: "Percent",
                  value: "percent",
                },
              ]}
            ></Select>
          </Form.Item>
        </div>
        <div className="flex gap-x-4">
          <Form.Item name={"startAt"} label="Start" className="w-full">
            <DatePicker showTime format={"DD/MM/YYYY HH:mm:ss"} />
          </Form.Item>
          <Form.Item name={"endAt"} label="End" className="w-full">
            <DatePicker showTime format={"DD/MM/YYYY HH:mm:ss"} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default PromotionModal;
