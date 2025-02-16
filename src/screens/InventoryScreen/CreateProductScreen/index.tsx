import { CopyOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import {
  Button,
  Divider,
  Form,
  GetProp,
  Input,
  message,
  Select,
  Space,
  Spin,
  TreeSelect,
  Upload,
  UploadFile,
  UploadProps,
  Image,
} from "antd";
import { useEffect, useRef, useState } from "react";
import handleAPI from "../../../apis/handleApi";
import { CategoryModal } from "../../../modals";
import { SelectModel, TreeModel } from "../../../models/FormModel";
import { getTreeData } from "../../../utils/getTreeData";
import { replaceName } from "../../../utils/replaceName";
import { uploadFile } from "../../../utils/uploadFile";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBase64 } from "../../../utils/getBase64";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const CreateProductScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [content, setContent] = useState("");

  const [supplierOption, setSupplierOption] = useState<SelectModel[]>([]);

  const [categoryOption, setCategoryOption] = useState<TreeModel[]>([]);

  const [fileUrl, setFileUrl] = useState("");

  const [isVisbleAddCategory, setIsVisbleAddCategory] = useState(false);

  const [isLoadingCreateProduct, setIsLoadingCreateProduct] = useState(false);

  const [fileList, setFileList] = useState<any[]>([]);

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const [previewImage, setPreviewImage] = useState("");

  const editorRef = useRef<any>(null);

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const [searchParam] = useSearchParams();

  const id = searchParam.get("id");

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    id && getProductDetail(id);
  }, [id]);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getSupplierList();
      await getCategoryList();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductDetail = async (id: string) => {
    const api = `/product/detail?id=${id}`;
    try {
      const res = await handleAPI(api);
      const data = res.data;

      if (data) {
        console.log(data);
        form.setFieldsValue(data);
        setContent(data.content);

        if (data.images && data.images.length > 0) {
          const items = [...fileList];
          data.images.forEach((url: string) =>
            items.push({
              uid: `image_${Date.now().toString()}`,
              name: url,
              status: "done",
              url,
            })
          );
          setFileList(items);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleCreateProduct = async (values: any) => {
    setIsLoadingCreateProduct(true);

    const content = editorRef.current.getContent();

    const data: any = {};

    for (const i in values) {
      data[i] = values[i] ?? "";
    }

    data.content = content;
    data.slug = replaceName(data.title);

    if (fileList.length > 0) {
      const urls: string[] = [];

      for (const file of fileList) {
        if (file.originFileObj) {
          const url = await uploadFile(file.originFileObj);
          if (url) {
            urls.push(url);
          }
        } else {
          urls.push(file.url);
        }
      }

      data.images = urls;
    }

    try {
      const api = `/product/${id ? `update?id=${id}` : `create`}`;
      const method = id ? "put" : "post";
      await handleAPI(api, data, method);
      navigate(-1);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoadingCreateProduct(false);
    }
  };

  const getSupplierList = async () => {
    const api = `/supplier`;
    const res = await handleAPI(api);
    const data = res.data.items;
    const options = data.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));
    setSupplierOption(options);
  };

  const getCategoryList = async () => {
    const api = `/category`;
    const res = await handleAPI(api);

    const data = res.data.items;

    setCategoryOption(getTreeData(data, true));
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
    <div className="px-6 py-4">
      {isLoading ? (
        <Spin />
      ) : (
        <div className="bg-white px-6 py-4 rounded-lg">
          <div className="flex w-full justify-between">
            <div className="text-xl">
              {id ? "Update product" : "Create product"}
            </div>
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  navigate(-1);
                }}
              >
                Cancel
              </Button>
              <Button
                loading={isLoadingCreateProduct}
                type="primary"
                onClick={() => {
                  form.submit();
                }}
              >
                {id ? "Update" : "Submit"}
              </Button>
            </Space>
          </div>
          <Form
            size="middle"
            disabled={isLoadingCreateProduct}
            form={form}
            onFinish={handleCreateProduct}
            layout="vertical"
          >
            <div className="flex flex-row gap-x-6">
              <div className="w-2/3">
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[
                    {
                      required: true,
                      message: "Please enter product title",
                    },
                  ]}
                >
                  <Input allowClear maxLength={150} showCount />
                </Form.Item>
                <Form.Item name={"description"} label="Description">
                  <Input.TextArea rows={4} showCount maxLength={1000} />
                </Form.Item>
                <Editor
                  disabled={isLoading || isLoadingCreateProduct}
                  apiKey="43qsfp1ypjtycnuhgct3c0vow2guutz01d4wkh2kzn7mr3lz"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={content !== "" ? content : ""}
                  // value={content}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </div>
              <div className="w-1/3">
                <Form.Item
                  name={"categories"}
                  label="Category"
                  rules={[
                    {
                      required: true,
                      message: "Please choose product category",
                    },
                  ]}
                >
                  <TreeSelect
                    showSearch
                    multiple
                    treeData={categoryOption}
                    dropdownRender={(menu) => (
                      <div className="">
                        {menu}
                        <Divider />
                        <Button
                          icon={<PlusOutlined />}
                          type="primary"
                          className="mx-auto flex my-2"
                          onClick={() => {
                            setIsVisbleAddCategory(true);
                          }}
                        >
                          Create category
                        </Button>
                      </div>
                    )}
                  />
                </Form.Item>
                <Form.Item
                  name={"supplier"}
                  label="Suppliers"
                  rules={[
                    {
                      required: true,
                      message: "Please choose product suppliers",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      replaceName(option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={supplierOption}
                    dropdownRender={(menu) => (
                      <div className="">
                        {menu}
                        <Divider />
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          className="mx-auto flex my-2"
                          onClick={() => {}}
                        >
                          Create supplier
                        </Button>
                      </div>
                    )}
                  />
                </Form.Item>
                <div className="flex flex-col gap-y-2 mb-6">
                  <Upload
                    name="images"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    multiple
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
                        afterOpenChange: (visible) =>
                          !visible && setPreviewImage(""),
                      }}
                      src={previewImage}
                    />
                  )}
                </div>

                <div className="flex flex-row w-full gap-x-2">
                  <Input
                    className="w-full"
                    allowClear
                    value={fileUrl}
                    onChange={(val) => setFileUrl(val.target.value)}
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard
                        .writeText(fileUrl)
                        .then(() => {
                          message.success("Copied successfully");
                        })
                        .catch((err) => {
                          console.error("Failed to copy: ", err);
                        });
                    }}
                  >
                    <CopyOutlined />
                  </Button>
                </div>
                <Input
                  className="mt-6"
                  type="file"
                  accept="image/*"
                  onChange={async (files: any) => {
                    const file = files.target.files[0];
                    if (file) {
                      const downloadUrl = await uploadFile(file);
                      downloadUrl && setFileUrl(downloadUrl);
                    }
                  }}
                />
              </div>
            </div>
          </Form>
        </div>
      )}
      <CategoryModal
        values={categoryOption}
        visible={isVisbleAddCategory}
        onClose={() => {
          setIsVisbleAddCategory(false);
        }}
        onFinish={async () => {
          await getCategoryList();
        }}
      />
    </div>
  );
};

export default CreateProductScreen;
