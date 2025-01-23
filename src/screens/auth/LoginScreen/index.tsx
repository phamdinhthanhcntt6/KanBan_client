import { Button, Checkbox, Form, Input, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import handleApi from "../../../apis/handleApi";
import { localDataNames } from "../../../constant/appInfor";
import { addAuth } from "../../../redux/reducers/authReducer";
import SocialLogin from "../component/SocialLogin";

const LoginScreen = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);

  const dispatch = useDispatch();

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res: any = await handleApi("/auth/login", values, "post");
      if (res.data) {
        dispatch(addAuth(res.data));
        message.success("Log in successfully");
      }
      if (isRemember) {
        localStorage.setItem(localDataNames.authData, JSON.stringify(res.data));
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center">
        <div className="text-[#2B2F38] text-3xl font-semibold">
          Log in to your account
        </div>
        <div className="text-[#667085] text-base font-normal mt-1">
          Welcome back! Please enter your details.
        </div>
      </div>
      <Form
        layout="vertical"
        form={form}
        className="mt-8"
        size="large"
        onFinish={handleLogin}
        disabled={isLoading}
        style={{ width: 320 }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Please enter your email",
            },
          ]}
        >
          <Input placeholder="Enter your email" allowClear />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
          ]}
        >
          <Input.Password placeholder="********" allowClear />
        </Form.Item>
      </Form>

      <div className="flex flex-row -mt-2">
        <div className="flex-1 flex-row flex items-center">
          <Checkbox
            checked={isRemember}
            onChange={(val) => setIsRemember(val.target.checked)}
          >
            Remember for 30 days
          </Checkbox>
        </div>
        <div className="text-[#F15E2B] text-sm font-medium">
          <Link to={"/forgot-password"}>Forgot password</Link>
        </div>
      </div>

      <Button
        loading={isLoading}
        className="w-full mt-6 bg-[#F15E2B] text-white"
        color="primary"
        onClick={() => form.submit()}
      >
        Sign in
      </Button>

      <SocialLogin isRemember={isRemember} />
      <div className="mx-auto text-center text-[#B9BDC7]">
        Don’t have an account?
        <span className="text-[#F15E2B] ml-1">
          <Link to={"/sign-up"}>Sign up</Link>
        </span>
      </div>
      {/* <Link to={"/sign-up"}>signup</Link> */}
    </div>
  );
};

export default LoginScreen;
