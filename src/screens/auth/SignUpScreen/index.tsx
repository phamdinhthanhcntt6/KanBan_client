import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import handleApi from "../../../apis/handleApi";
import { localDataNames } from "../../../constant/appInfor";
import { addAuth } from "../../../redux/reducers/authReducer";
import SocialLogin from "../component/SocialLogin";

const SignupScreen = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignup = async (values: { email: string; password: string }) => {
    const api = `/auth/register`;

    setIsLoading(true);
    try {
      const res: any = await handleApi(api, values, "post");
      if (res.data) {
        localStorage.setItem(localDataNames.authData, JSON.stringify(res.data));
        dispatch(addAuth(res.data));
        message.success("Sign in successfully");
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
          Create an account
        </div>
        <div className="text-[#667085] text-base font-normal mt-1">
          Start your 30-day free trial.
        </div>
      </div>
      <Form
        layout="vertical"
        form={form}
        className="mt-8"
        size="large"
        onFinish={handleSignup}
        disabled={isLoading}
        style={{ width: 320 }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please enter your name",
            },
          ]}
        >
          <Input placeholder="Enter your name" allowClear />
        </Form.Item>
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
            () => ({
              validator: (_, value) => {
                if (value.length < 6) {
                  return Promise.reject(
                    new Error("Password must contain at least 6 characters!")
                  );
                } else {
                  return Promise.resolve();
                }
              },
            }),
          ]}
        >
          <Input.Password placeholder="********" allowClear />
        </Form.Item>
      </Form>

      <Button
        className="w-full mt-6 bg-[#F15E2B] text-white"
        color="default"
        onClick={() => form.submit()}
        loading={isLoading}
      >
        Get started
      </Button>

      <SocialLogin />

      <div className="mx-auto text-center text-[#B9BDC7]">
        Already have an account?
        <span className="text-[#F15E2B] ml-1">
          <Link to={"/"}>Log in</Link>
        </span>
      </div>
    </div>
  );
};

export default SignupScreen;
