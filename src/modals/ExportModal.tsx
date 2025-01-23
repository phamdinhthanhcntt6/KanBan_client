import { Checkbox, DatePicker, List, message, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleApi";
import { FormModel } from "../models/FormModel";
import { DateTime } from "../utils/dateTime";
import { handleExportToExcel } from "../utils/handleExportToExcel";

const { RangePicker } = DatePicker;

interface Props {
  visible: boolean;
  onClose: () => void;
  api: string;
}

const ExportModal = (props: Props) => {
  const { visible, onClose, api } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [forms, setForms] = useState<FormModel>();

  const [isLoadingExport, setIsLoadingExport] = useState(false);

  const [checkValues, setCheckValues] = useState<string[]>([]);

  const [timeSelected, setTimeSelected] = useState<string>("range");

  const [dates, setDates] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    getForm();
  }, [api, visible]);

  const getForm = async () => {
    const url = `${api}/get-form`;
    setIsLoadingExport(true);
    try {
      const res = await handleAPI(url);
      res.data && setForms(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingExport(false);
    }
  };

  const handleChangeCheckbox = (value: string) => {
    const items = [...checkValues];
    const index = items.findIndex((element) => element === value);

    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(value);
    }

    setCheckValues(items);
  };

  const handleExport = async () => {
    let url = ``;
    if (timeSelected !== "all" && dates.start && dates.end) {
      if (new Date(dates.start) < new Date(dates.end)) {
        url = `${api}/get-export-data?start=${dates.start}&end=${dates.end}`;
      } else {
        message.error("Start date must be less than end date");
      }
    } else {
      url = `${api}/get-export-data`;
    }

    const data = checkValues;

    if (Object.keys(data).length > 0) {
      setIsLoading(true);
      try {
        const res = await handleAPI(url, data, "post");

        res.data && handleExportToExcel(res.data, api);
      } catch (error: any) {
        message.error("Error while exporting data", error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      message.error("Please select at least one field");
    }
  };

  return (
    <Modal
      loading={isLoadingExport}
      className="w-1/3"
      open={visible}
      onCancel={onClose}
      onOk={() => handleExport()}
      onClose={onClose}
      okButtonProps={{ loading: isLoading }}
      title="Export to Excel"
    >
      <div className="flex flex-col">
        <Checkbox
          className="mt-2"
          checked={timeSelected === "all"}
          onChange={() => {
            setTimeSelected(timeSelected === "all" ? "range" : "all");
          }}
        >
          All time
        </Checkbox>

        <Checkbox
          className="mt-2"
          checked={timeSelected === "range"}
          onChange={() => {
            setTimeSelected(timeSelected === "all" ? "range" : "all");
          }}
        >
          Range time
        </Checkbox>

        {timeSelected === "range" && (
          <Space direction="vertical" className="mt-2">
            <RangePicker
              onChange={(val: any) => {
                setDates(
                  val && val[0] && val[1]
                    ? {
                        start: `${DateTime.CalendarDate(
                          val[0].toDate()
                        )} 00:00:00`,
                        end: `${DateTime.CalendarDate(
                          val[1].toDate()
                        )} 00:00:00`,
                      }
                    : {
                        start: "",
                        end: "",
                      }
                );
              }}
            />
          </Space>
        )}
      </div>

      <div className="mt-2">
        <List
          dataSource={forms?.formItem}
          renderItem={(item) => (
            <List.Item key={item.key}>
              <Checkbox
                checked={checkValues.includes(item.value)}
                onChange={() => handleChangeCheckbox(item.value)}
              >
                {item.label}
              </Checkbox>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};

export default ExportModal;
