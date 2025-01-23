import {
  BarChartOutlined,
  CodeSandboxOutlined,
  HomeOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import { Link } from "react-router-dom";
import { images } from "../assets/image";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const SiderComponent = () => {
  const items: MenuItem[] = [
    {
      key: "dashboard",
      label: <Link to={"/"}>Dashboard</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "inventory",
      label: <Link to={"/inventory"}>Inventory</Link>,
      icon: <ShoppingCartOutlined />,
      children: [
        {
          key: "add_product",
          label: <Link to={"/inventory/product"}>Product</Link>,
        },
      ],
    },
    {
      key: "category",
      label: <Link to={"/category"}>Category</Link>,
      icon: <TagOutlined />,
    },
    {
      key: "report",
      label: <Link to={"/report"}>Report</Link>,
      icon: <BarChartOutlined />,
    },
    {
      key: "suppliers",
      label: <Link to={"/suppliers"}>Suppliers</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "orders",
      label: <Link to={"/orders"}>Orders</Link>,
      icon: <CodeSandboxOutlined />,
    },
    {
      key: "managestore",
      label: <Link to={"/manage-store"}>Manage Store</Link>,
      icon: <ProfileOutlined />,
    },
  ];
  return (
    <Sider className="min-h-screen bg-white w-full rounded-lg ">
      <Link
        className="my-2 mx-2 flex flex-row items-center cursor-pointer w-full"
        to={"/"}
      >
        <img src={images.logo} className="w-12 h-12" alt="images" />
        <div className="text-[#F15E2B] font-semibold text-[20px]">KANBAN</div>
      </Link>
      <Menu items={items} mode="inline" className="w-full border-l-0" />
    </Sider>
  );
};

export default SiderComponent;
