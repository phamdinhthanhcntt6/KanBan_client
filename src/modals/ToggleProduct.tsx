import { Form, Modal } from "antd";
import { useEffect, useState } from "react";
import { FormModel } from "../models/FormModel";
import FormItemComponent from "../components/FormItemComponent";
import handleAPI from "../apis/handleApi";

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface ProductModel {}

const ToggleProduct = (props: Props) => {
  const { visible, onClose } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingGetFormData, setIsLoadingGetFormData] = useState(false);

  const [formData, setFormData] = useState<FormModel>();

  const [form] = Form.useForm();

  useEffect(() => {
    getFormData();
  }, []);

  const handleClose = () => {
    onClose();
  };

  const getFormData = async () => {
    const api = `/product/get-form`;
    try {
      setIsLoadingGetFormData(true);
      const res = await handleAPI(api);
      res.data && setFormData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingGetFormData(false);
    }
  };

  const handleCreateProduct = async (values: ProductModel) => {
    try {
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      loading={isLoadingGetFormData}
      closable={!isLoading}
      title="Product"
      open={visible}
      onCancel={handleClose}
      onClose={handleClose}
    >
      {formData && (
        <Form
          form={form}
          onFinish={handleCreateProduct}
          disabled={isLoading}
          layout="horizontal"
        >
          {formData.formItem.map((item, index) => (
            <FormItemComponent key={index} item={item} />
          ))}
        </Form>
      )}
    </Modal>
  );
};

export default ToggleProduct;
