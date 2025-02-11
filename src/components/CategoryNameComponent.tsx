import { useEffect, useState } from "react";
import handleAPI from "../apis/handleApi";
import { CategoryModel } from "../models/CategoryModel";
import { Tag } from "antd";
import { Link } from "react-router-dom";
import { tagColor } from "../constant/colors";

interface Props {
  id: string;
}

const CategoryNameComponent = (props: Props) => {
  const { id } = props;

  const [category, setCategory] = useState<CategoryModel>();

  useEffect(() => {
    getCategoryDetail(id);
  }, []);

  const getCategoryDetail = async (id: string) => {
    const api = `/category/detail?id=${id}`;
    try {
      const res = await handleAPI(api);
      res.data && setCategory(res.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Link to={`/category/detail/id=${id}`}>
      <Tag color={tagColor[Math.floor(Math.random() * tagColor.length)]}>
        {category?.title}
      </Tag>
    </Link>
  );
};

export default CategoryNameComponent;
