import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Input, Layout, MenuProps } from "antd";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { icons } from "../assets/icon";
import { auth } from "../firebase/firebaseConfig";
import { authSelector, removeAuth } from "../redux/reducers/authReducer";

const { Header } = Layout;

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector(authSelector);
  const navigate = useNavigate();

  const handleLogout = async () => {
    signOut(auth);
    dispatch(removeAuth({}));
    localStorage.clear();
    navigate("/");
  };

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: async () => {
        handleLogout();
      },
    },
  ];

  return (
    <Header className="bg-white rounded-lg flex flex-row items-center sticky">
      <div className="flex-1">
        <Input
          prefix={<SearchOutlined className="mr-1" />}
          placeholder="Search product, supplier, order"
          className="w-1/4"
        />
      </div>
      <div className="flex items-center flex-row gap-6">
        <Badge count={10} className="">
          <img
            src={icons.notification}
            className="cursor-pointer"
            onClick={() => {}}
            alt="notification"
          />
        </Badge>
        <Dropdown menu={{ items }}>
          <Avatar
            src={user.photoUrl}
            alt="avartar"
            className="cursor-pointer"
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;
