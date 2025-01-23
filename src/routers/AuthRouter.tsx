import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import { images } from "../assets/image";

const AuthRouter = () => {
  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="w-1/2 items-center mx-auto flex flex-col my-auto max-xl:hidden">
        <img src={images.logo} alt="logo" />
        <div className="text-[#F15E2B] font-semibold text-4xl">KanBan</div>
      </div>
      <div className="w-1/2 max-xl:w-screen my-auto flex flex-col mx-auto">
        <img src={images.logo} alt="logo" className="w-20 h-20 mx-auto" />
        <div className="mx-auto">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginScreen />} />
              <Route path="/sign-up" element={<SignUpScreen />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;
