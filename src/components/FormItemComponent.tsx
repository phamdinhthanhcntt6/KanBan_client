import { Checkbox, DatePicker, Form, Input, Select } from "antd";
import { FormItemModel } from "../models/FormModel";

interface Props {
  item: FormItemModel;
}

const FormItemComponent = (props: Props) => {
  const { item } = props;

  const renderItem = (item: FormItemModel) => {
    let content = <></>;
    switch (item.type) {
      case "checkbox": {
        content = <Checkbox />;
        break;
      }
      case "select": {
        content = <Select options={item.lockup_item ?? []} />;
        break;
      }
      case "datetime": {
        content = <DatePicker allowClear placeholder={item.placeholder} />;
        break;
      }
      default:
        content = (
          <Input type={item.type} placeholder={item.placeholder} allowClear />
        );
        break;
    }

    return content;
  };

  return (
    <Form.Item
      key={item.key}
      name={item.value}
      label={item.label}
      rules={[
        {
          required: item.required,
          message: item.message,
        },
      ]}
    >
      {renderItem(item)}
    </Form.Item>
  );
};

export default FormItemComponent;
