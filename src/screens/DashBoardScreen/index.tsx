import InventorySummaryComponent from "./components/InventorySummaryComponent";
import LowQuantityStockComponent from "./components/LowQuantityStockComponent";
import ProductSummaryComponent from "./components/ProductSummaryComponent";
import PurchaseOverviewComponent from "./components/PurchaseOverviewComponent";
import SaleOverviewComponent from "./components/SaleOverviewComponent";
import TopSellingStockComponent from "./components/TopSellingStockComponent";

const DashboardScreen = () => {
  return (
    <div className="flex mx-8 h-full mt-[10px] flex-col gap-y-4">
      <div className="flex flex-row w-full gap-x-5 max-lg:flex-col gap-y-5">
        <SaleOverviewComponent />
        <InventorySummaryComponent />
      </div>
      <div className="flex flex-row w-full gap-x-5 max-lg:flex-col gap-y-5">
        <PurchaseOverviewComponent />
        <ProductSummaryComponent />
      </div>
      <div className="flex flex-row w-full gap-x-5 max-lg:flex-col gap-y-5">
        <TopSellingStockComponent />
        <LowQuantityStockComponent />
      </div>
    </div>
  );
};

export default DashboardScreen;
