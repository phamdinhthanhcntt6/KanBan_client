import { Button } from "antd";

const ProductScreen = () => {
  return (
    <div>
      ProductScreen
      <Button
        onClick={() => {
          window.location.href = "/inventory/product/add-product";
        }}
      >
        Add Product
      </Button>
    </div>
  );
};

export default ProductScreen;
