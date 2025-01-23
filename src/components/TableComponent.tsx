import { Button, Table, Typography } from "antd";
import { FormModel } from "../models/FormModel";
import { useEffect, useState } from "react";
import { ColumnProps } from "antd/es/table";
import { Resizable } from "re-resizable";
import { ExportModal } from "../modals";

interface Props {
  forms: FormModel;
  loading?: boolean;
  records: any[];
  onPageChange: (val: { page: number; pageSize: number }) => void;
  onCreate: () => void;
  scrollHeight?: string;
  total: number;
  extraColumn?: (item: any) => void;
  api: string;
  size?: "middle" | "small" | "large";
  index?: boolean;
  exportExcel?: boolean;
  titleButton?: string;
}

const { Title } = Typography;

const TableComponent = (props: Props) => {
  const {
    forms,
    total,
    loading,
    records,
    onPageChange,
    onCreate,
    scrollHeight,
    extraColumn,
    api,
    size,
    index,
    exportExcel,
    titleButton,
  } = props;

  const [pageInfo, setPageInfo] = useState<{
    page: number;
    pageSize: number;
  }>({ page: 1, pageSize: 10 });

  const [columns, setColumns] = useState<ColumnProps<any>[]>([]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    onPageChange(pageInfo);
  }, [pageInfo]);

  useEffect(() => {
    if (forms && forms.formItem && forms.formItem.length > 0) {
      const items: any[] = [];

      forms.formItem.forEach((item: any) =>
        items.push({
          key: item.key,
          dataIndex: item.value,
          title: item.label,
          width: item.displayLength,
        })
      );

      {
        index &&
          items.unshift({
            key: "index",
            dataIndex: "index",
            title: "#",
            align: "center",
            width: 100,
          });
      }

      if (extraColumn) {
        items.push({
          key: "actions",
          dataIndex: "",
          title: "Action",
          align: "center",
          fixed: "right",
          width: 100,
          render: (item: any) => extraColumn(item),
        });
      }

      setColumns(items);
    }
  }, [forms]);

  const RenderTitle = (props: any) => {
    const { children, ...restProps } = props;
    return (
      <th {...restProps}>
        <Resizable
          enable={{ right: true }}
          onResizeStop={(e, direction, ref, d) => {
            const item = columns.find(
              (element) => element.title === children[1]
            );

            if (item) {
              const items = [...columns];

              const newWidth = (item.width as number) + d.width;

              const index = columns.findIndex(
                (element) => element.title === item.key
              );

              if (index !== -1) {
                items[index].width = newWidth;
              }

              setColumns(items);
            }
          }}
        >
          {children}
        </Resizable>
      </th>
    );
  };

  return (
    <>
      <Table
        size={size ?? "middle"}
        pagination={{
          // showSizeChanger: true,
          onShowSizeChange: (size, current) => {
            setPageInfo({ ...pageInfo, pageSize: size });
          },
          total,
          onChange: (page, pageSize) => {
            setPageInfo({ ...pageInfo, page });
          },
          showQuickJumper: true,
        }}
        scroll={{
          y: scrollHeight,
        }}
        bordered
        loading={loading}
        dataSource={records}
        columns={columns}
        title={() => (
          <div className="flex flex-row justify-between">
            <Title level={5}>{forms?.title}</Title>
            <div className="flex flex-row gap-x-3">
              <Button className="bg-[#F15E2B] text-white" onClick={onCreate}>
                {titleButton ?? "Add Product"}
              </Button>
              {/* <Button>Filters</Button> */}
              {exportExcel && (
                <Button onClick={() => setIsVisible(true)}>Export</Button>
              )}
            </div>
          </div>
        )}
        components={{
          header: {
            cell: RenderTitle,
          },
        }}
      />
      <ExportModal
        visible={isVisible}
        onClose={() => {
          setIsVisible(false);
        }}
        api={api}
      />
    </>
  );
};

export default TableComponent;
