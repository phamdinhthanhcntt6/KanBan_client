import { Button, message } from "antd";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import handleAPI from "../../../apis/handleApi";
import { localDataNames } from "../../../constant/appInfor";
import { auth } from "../../../firebase/firebaseConfig";
import { addAuth } from "../../../redux/reducers/authReducer";

interface Props {
  isRemember?: boolean;
}

const SocialLogin = (props: Props) => {
  const { isRemember } = props;
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  // provider.setCustomParameters({
  //   login_hint: "",
  // });

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const res = await signInWithPopup(auth, provider);

      if (res) {
        const user = res.user;
        if (user) {
          const data = {
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
          };
          const api = `/auth/google-login`;

          try {
            const res: any = await handleAPI(api, data, "post");
            message.success(res.message);
            dispatch(addAuth(res.data));
            if (isRemember) {
              localStorage.setItem(
                localDataNames.authData,
                JSON.stringify(res.data)
              );
            }
          } catch (error: any) {
            message.error(error.message);
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        console.log("Cannot login with Google");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      loading={isLoading}
      onClick={() => handleLoginWithGoogle()}
      className="w-full mt-4 mb-8"
      icon={
        <img
          width="24"
          height="24"
          src="https://img.icons8.com/fluency/48/google-logo.png"
          alt="google-logo"
        />
      }
    >
      Sign in with Google
    </Button>
  );
};

export default SocialLogin;
