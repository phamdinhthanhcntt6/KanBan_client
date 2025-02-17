import { Button } from "antd";
import axios from "axios";
import { useState } from "react";
import { replaceName } from "../../../utils/replaceName";
import handleAPI from "../../../apis/handleApi";

const ProductDetailScreen = () => {
  const [dataDemo, setdataDemo] = useState<any[]>([]);

  const getDataDemo = async () => {
    const api = `https://fakestoreapi.com/products`;

    try {
      const res = await axios.get(api);

      const data = res.data;
      console.log(data);
      data.forEach((element: any) => {
        handleAddData(element);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddData = async (item: any) => {
    const api = `product/create`;
    const data = {
      title: item.title,
      slug: replaceName(item.title),
      description: item.description,
      images: [item.image],
      categories: ["67b2e27f5c856892cdb83e34"],
      supplier: "6745fcaea3b5a726c2f279fa",
    };

    try {
      await handleAPI(api, data, "post");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex px-4 py-5 rounded-lg h-max mx-8 my-[10px] bg-white">
      {/* <Button onClick={() => getDataDemo()}>Button</Button> */}
    </div>
  );
};

export default ProductDetailScreen;
