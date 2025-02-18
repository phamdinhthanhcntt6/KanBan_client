import { Button, Card, Empty, Form, Select, Slider, Spin } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleApi";
import { SelectModel } from "../models/FormModel";
import { FilterOutlined } from "@ant-design/icons";
import { FilterModel } from "../models/FilterModel";

interface Props {
  onFilter: (val: FilterModel) => void;
}

const FilterComponent = (props: Props) => {
  const { onFilter } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectData, setSelectData] = useState<{
    category: SelectModel[];
    colors: string[];
    sizes: SelectModel[];
    prices: number[];
  }>();

  const [form] = Form.useForm();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (selectData && selectData.category && selectData.category.length > 0) {
      getFilterData();
    }
  }, [selectData?.category]);

  const getData = async () => {
    try {
      setIsLoading(true);
      await getFilterData();
      await getCategories();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeValue = async (key: string, val: any) => {
    const items: any = { ...selectData };
    items[key] = val;
    setSelectData(items);
  };

  const getCategories = async () => {
    const api = `/category`;
    const res = await handleAPI(api);
    const items = res.data.items;

    const data =
      items && items.length > 0
        ? items.map((item: any) => ({
            label: item.title,
            value: item._id,
          }))
        : [];
    handleChangeValue("category", data);
  };

  const getFilterData = async () => {
    const api = `/sub-product/filter`;

    const res = await handleAPI(api);

    const data: any = res.data;

    const items: any = { ...selectData };

    for (const i in data) {
      items[i] = data[i];
    }

    setSelectData(items);
  };

  const handleFilter = (value: FilterModel) => {
    onFilter(value);
  };

  return (
    <Card className="w-[360px] filter-shadow">
      {isLoading ? (
        <Spin />
      ) : selectData ? (
        <div className="flex flex-col">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFilter}
            title="Filter"
          >
            <div className="font-semibold text-lg mb-2">Filter</div>
            <Form.Item name="category" label="Category">
              <Select
                placeholder="Choose category"
                allowClear
                options={selectData.category}
                mode="multiple"
                className="w-full"
              />
            </Form.Item>
            <Form.Item name="color" label="Color">
              <Select
                placeholder="Choose color"
                className="w-full"
                mode="multiple"
                allowClear
              >
                {selectData.colors &&
                  selectData.colors.length > 0 &&
                  selectData.colors.map((color) => (
                    <Select.Option key={color} value={color} label={color}>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 mr-2 border border-solid border-[#ccc]`}
                          style={{
                            backgroundColor: color,
                          }}
                        />
                        <span>{color}</span>
                      </div>
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item name="size" label="Size">
              <Select
                placeholder="Choose size"
                options={selectData.sizes}
                className="w-full"
                allowClear
              />
            </Form.Item>
            {selectData.prices && selectData.prices.length > 0 && (
              <Form.Item name={"price"} label="Price">
                <Slider
                  range
                  min={
                    selectData.prices.length !== 1
                      ? Math.min(...selectData.prices)
                      : 0
                  }
                  max={Math.max(...selectData.prices)}
                />
              </Form.Item>
            )}
          </Form>
          <div className="text-end">
            <Button onClick={() => form.submit()} icon={<FilterOutlined />} />
          </div>
        </div>
      ) : (
        <Empty />
      )}
    </Card>
  );
};

export default FilterComponent;
