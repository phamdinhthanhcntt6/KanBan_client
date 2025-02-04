import { Button } from "antd";
import { useSearchParams } from "react-router-dom";

const CategoryDetailScreen = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  console.log("-----", id);

  return (
    <div>
      <Button
        onClick={() => {
          window.history.back();
        }}
      >
        Back
      </Button>
    </div>
  );
};

export default CategoryDetailScreen;
