import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, message, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import handleAPI from "../apis/handleApi";
import FormItemComponent from "../components/FormItemComponent";
import { FormModel } from "../models/FormModel";
import { SupplierModel } from "../models/SupplierModel";
import { replaceName } from "../utils/replaceName";
import { uploadFile } from "../utils/uploadFile";

interface Props {
  visible: boolean;
  onClose: () => void;
  onFinish: (val: any) => void;
  supplier?: SupplierModel;
}

const ToogleSupplier = (props: Props) => {
  const { visible, onClose, onFinish, supplier } = props;

  const [isTaking, setIsTaking] = useState<boolean>();

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingGetFormData, setIsLoadingGetFormData] = useState(false);

  const [formData, setformData] = useState<FormModel>();

  const [file, setFile] = useState<any>();

  const [form] = Form.useForm();

  const inpRef = useRef<any>();

  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier);
      setIsTaking(supplier.isTaking === 1);
    }
  }, [supplier]);

  useEffect(() => {
    getFormData();
  }, []);

  const handleCreateSupplier = async (values: any) => {
    setIsLoading(true);

    const data: any = {};
    const api = `/supplier/${
      supplier ? `update?id=${supplier._id}` : `create`
    }`;
    for (const i in values) {
      data[i] = values[i] ?? "";
    }

    data.price = values.price ? parseInt(values.price) : 0;

    data.isTaking = isTaking ? 1 : 0;

    if (file) {
      data.photoUrl = await uploadFile(file);
    }

    data.slug = replaceName(values.name);

    try {
      const res: any = await handleAPI(api, data, supplier ? "put" : "post");
      message.success(res.message);
      !supplier && onFinish(res.data);
      handleClose();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFormData = async () => {
    const api = `/supplier/get-form`;
    setIsLoadingGetFormData(true);
    try {
      const res = await handleAPI(api);
      res.data && setformData(res.data);
      setIsLoadingGetFormData(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingGetFormData(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFile(undefined);
    onClose();
  };

  return (
    <Modal
      loading={isLoadingGetFormData}
      closable={!isLoading}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      title={supplier ? "Update supplier" : "Add supplier"}
      okText={supplier ? "Update supplier" : "Add supplier"}
      cancelText="Discard"
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading }}
    >
      <label
        htmlFor="inpFile"
        className="p-2 mb-3 text-center flex flex-row items-center gap-x-5 w-full justify-center"
      >
        {file ? (
          <Avatar src={URL.createObjectURL(file)} size={100} />
        ) : supplier ? (
          <Avatar src={supplier.photoUrl} size={100} />
        ) : (
          <Avatar size={100} className="bg-slate-300 border-dashed">
            <UserOutlined size={300} color="red" />
          </Avatar>
        )}
        <div>
          <div className="text-[#858D9D] -mb-1">Drag image here</div>
          <div className="text-[#858D9D] -mb-1">or</div>
          <Button
            onClick={() => {
              inpRef.current.click();
            }}
            type="link"
          >
            Brower image
          </Button>
        </div>
      </label>
      {formData && (
        <Form
          disabled={isLoading}
          onFinish={handleCreateSupplier}
          form={form}
          layout={formData.layout}
          className="w-full"
          labelCol={{ span: formData.labelCol }}
          wrapperCol={{ span: formData.wrapperCol }}
        >
          {formData.formItem.map((item, index) => (
            <FormItemComponent item={item} key={index} />
          ))}
        </Form>
      )}
      <div className="hidden">
        <input
          ref={inpRef}
          accept="image/*"
          type="file"
          name=""
          id="inpFile"
          onChange={(val: any) => {
            setFile(val.target.files[0]);
          }}
        />
      </div>
    </Modal>
  );
};

export default ToogleSupplier;
