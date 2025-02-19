import { useState } from "react";

const ProductDetailScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="flex px-4 py-5 rounded-lg h-max mx-8 my-[10px] bg-white"></div>
  );
};

export default ProductDetailScreen;
