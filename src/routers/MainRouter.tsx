import { Layout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import SiderComponent from "../components/SiderComponent";
import CategoryScreen from "../screens/CategoryScreen";
import DashboardScreen from "../screens/DashBoardScreen";
import InventoryScreen from "../screens/InventoryScreen";
import CreateProductScreen from "../screens/InventoryScreen/CreateProductScreen";
import ManageStoreScreen from "../screens/ManageStoreScreen";
import OrderScreen from "../screens/OrderScreen";
import ReportScreen from "../screens/ReportScreen";
import SuppliersScreen from "../screens/SupplierScreen";
import CategoryDetailScreen from "../screens/CategoryScreen/CategoryDetailScreen";

const { Content } = Layout;

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout className="gap-1 flex">
        <SiderComponent />
        <Layout className="h-screen">
          <HeaderComponent />
          <Content className="overflow-y-auto hide-scrollbar h-full">
            <Routes>
              <Route path="/" element={<DashboardScreen />} />
              <Route>
                <Route path="/inventory" element={<InventoryScreen />} />
                <Route
                  path="/inventory/create-product"
                  element={<CreateProductScreen />}
                />
              </Route>
              <Route>
                <Route path="/category" element={<CategoryScreen />} />
                <Route
                  path="/category/detail/:id"
                  element={<CategoryDetailScreen />}
                />
              </Route>
              <Route path="/report" element={<ReportScreen />} />
              <Route path="/suppliers" element={<SuppliersScreen />} />
              <Route path="/orders" element={<OrderScreen />} />
              <Route path="/manage-store" element={<ManageStoreScreen />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
