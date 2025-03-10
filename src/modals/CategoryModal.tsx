import { Form, Input, message, Modal, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleApi";
import { TreeModel } from "../models/FormModel";
import { replaceName } from "../utils/replaceName";

interface Props {
  visible: boolean;
  onClose: () => void;
  onFinish: (val: any) => void;
  values: TreeModel[];
  category?: string;
}

const CategoryModal = (props: Props) => {
  const { visible, onClose, onFinish, values, category } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (category) {
      getCategoryDetail(category);
    }
  }, [category]);

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  const getCategoryDetail = async (id: string) => {
    const api = `/category/detail?id=${id}`;
    const res = await handleAPI(api);
    form.setFieldsValue(res.data);
  };

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    const api = `/category/${category ? `update?id=${category}` : `create`}`;

    const data: any = {};

    for (const i in values) {
      data[i] = values[i] ?? "";
    }

    data.slug = replaceName(values.title);

    try {
      const res = await handleAPI(api, data, category ? "put" : "post");
      message.success(
        `${category ? "Update" : "Create"} category successfully!`
      );
      !category && onFinish(res.data);
      handleClose();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={category ? "Update Category" : "Create Category"}
      onCancel={handleClose}
      closable={!isLoading}
      onClose={handleClose}
      onOk={() => form.submit()}
      okText={category ? "Update" : "Create"}
      okButtonProps={{
        loading: isLoading,
        disabled: isLoading,
      }}
      cancelButtonProps={{ loading: isLoading, disabled: isLoading }}
    >
      <Form
        form={form}
        layout="vertical"
        size="middle"
        onFinish={handleSubmit}
        disabled={isLoading}
      >
        <Form.Item name={"parentId"} label="Parent Category">
          <TreeSelect
            treeData={values}
            allowClear
            showSearch
            treeDefaultExpandAll
            filterTreeNode={(input: any, option: any) =>
              replaceName(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          name={"title"}
          label="Title"
          rules={[
            {
              required: true,
              message: "Please enter title category",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item name={"description"} label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
