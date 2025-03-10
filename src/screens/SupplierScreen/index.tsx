import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, message, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleApi";
import TableComponent from "../../components/TableComponent";
import ToogleSupplier from "../../modals/ToggleSupplier";
import { FormModel } from "../../models/FormModel";
import { SupplierModel } from "../../models/SupplierModel";

const { confirm } = Modal;

const SuppliersScreen = () => {
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);

  const [isVisibleSupplierModal, setIsVisibleSupplierModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [supplierSelected, setSupplierSelected] = useState<SupplierModel>();

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState<number>(10);

  const [forms, setForms] = useState<FormModel>();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getSuppliers();
  }, [page, pageSize]);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getSuppliers();
      await getForm();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuppliers = async () => {
    const api = `/supplier?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      res.data && setSuppliers(res.data.items);

      const items: SupplierModel[] = [];

      res.data.items.forEach((item: any, index: number) =>
        items.push({
          index: (page - 1) * pageSize + index + 1,
          ...item,
        })
      );

      setSuppliers(items);

      setTotal(res.data.total);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSupplier = async (id: string) => {
    try {
      await handleAPI(`supplier/remove?id=${id}`, undefined, "delete");
      getSuppliers();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getForm = async () => {
    const api = `/supplier/get-form`;
    const res = await handleAPI(api);
    res.data && setForms(res.data);
  };

  return (
    <div className="mt-[10px] bg-white mx-8 rounded-lg h-max">
      {forms && (
        <TableComponent
          index
          size="middle"
          api="/supplier"
          loading={isLoading}
          forms={forms}
          records={suppliers}
          exportExcel
          titleButton="Add Supplier"
          onPageChange={(val) => {
            setPage(val.page);
            setPageSize(val.pageSize);
          }}
          onCreate={() => {
            setIsVisibleSupplierModal(true);
          }}
          total={total}
          extraColumn={(item) => (
            <Space>
              <Button
                type="text"
                onClick={() => {
                  setSupplierSelected(item);
                  setIsVisibleSupplierModal(true);
                }}
                icon={<EditTwoTone twoToneColor="blue" size={18} />}
              />
              <Button
                onClick={() =>
                  confirm({
                    title: "Comfirm",
                    content: "Are you sure you want to remove this supplier?",
                    onOk: () => removeSupplier(item._id),
                  })
                }
                type="text"
                icon={<DeleteTwoTone twoToneColor="#F15E2B" size={18} />}
              />
            </Space>
          )}
        />
      )}
      <ToogleSupplier
        visible={isVisibleSupplierModal}
        onClose={() => {
          supplierSelected && getSuppliers();
          setSupplierSelected(undefined);
          setIsVisibleSupplierModal(false);
        }}
        onFinish={(val) => setSuppliers([...suppliers, val])}
        supplier={supplierSelected}
      />
    </div>
  );
};

export default SuppliersScreen;
