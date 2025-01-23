import { useDispatch, useSelector } from "react-redux";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";
import { addAuth, authSelector } from "../redux/reducers/authReducer";
import { useEffect, useState } from "react";
import { localDataNames } from "../constant/appInfor";
import { Spin } from "antd";

const Router = () => {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector(authSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = localStorage.getItem(localDataNames.authData);
    res && dispatch(addAuth(JSON.parse(res)));
  };

  return isLoading ? <Spin /> : auth.token ? <MainRouter /> : <AuthRouter />;
};

export default Router;
