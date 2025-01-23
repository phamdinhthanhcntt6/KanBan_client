import { Card, Table, Typography } from "antd";
import { StatisticModel } from "../models/StatisticModel";
import { formatCurrency, formatNumber } from "../utils/numberFormat";

const { Title } = Typography;

interface Props {
  title?: string;
  data: StatisticModel[] | any;
  width?: string;
  layout?: "horizontal" | "vertical";
  type?: "chart" | "table" | "statistic";
  className?: string;
  columns?: any;
}

const StatisticComponent = (props: Props) => {
  const { title, data, width, type, layout, className, columns } = props;

  return (
    <Card className={`bg-white h-full ${width} ${className}`}>
      <Title level={4} className="text-gray-800" color="#383E49">
        {title ? title : ""}
      </Title>
      {type === "statistic" && (
        <div className="flex flex-row justify-between mt-4">
          {data.map((item: StatisticModel, index: number) => (
            <>
              <div key={item.key} className="">
                <div className="flex mx-auto align-middle">
                  {item.icon && (
                    <img src={item.icon} alt="icon" className="mx-auto" />
                  )}
                </div>
                <div
                  className={`flex gap-x-8 mt-2 ${
                    layout === "horizontal"
                      ? "flex-row"
                      : "flex-col text-center"
                  }`}
                >
                  <div className="font-bold text-gray-500">
                    {item.valueTtype === "number"
                      ? formatNumber(item.value.toLocaleString())
                      : formatCurrency.VND.format(item.value)}
                  </div>
                  <div className="text-gray-500 font-medium">
                    {item.description}
                  </div>
                </div>
              </div>
              {index < data.length - 1 && <div className="border" />}
            </>
          ))}
        </div>
      )}
      {type === "table" && (
        <Table
          pagination={{
            hideOnSinglePage: true,
          }}
          dataSource={data}
          columns={columns}
        />
      )}
      {type === "chart" && <>Chart</>}
    </Card>
  );
};

export default StatisticComponent;
