import { useEffect, useState } from "react";
import handleAPI from "../apis/handleApi";
import { Tag } from "antd";
import { Link } from "react-router-dom";
import { tagColor } from "../constant/colors";

interface Props {
  id: string;
  type: "category" | "supplier";
}

const DisplayNameComponent = (props: Props) => {
  const { id, type } = props;

  const [detail, setDetail] = useState<any>();

  useEffect(() => {
    getDetail(id);
  }, [id]);

  const getApi = (type: string) => {
    switch (type) {
      case "category":
        return "category";
      case "supplier":
        return "supplier";
    }
  };

  const getDetail = async (id: string) => {
    const api = `/${getApi(type)}/detail?id=${id}`;
    try {
      const res = await handleAPI(api);
      res.data && setDetail(res.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      {type === "category" && (
        <Link to={`/category/detail/id=${id}`}>
          <Tag color={tagColor[Math.floor(Math.random() * tagColor.length)]}>
            {detail?.title}
          </Tag>
        </Link>
      )}
      {type === "supplier" && <>{detail?.name}</>}
    </>
  );
};

export default DisplayNameComponent;
