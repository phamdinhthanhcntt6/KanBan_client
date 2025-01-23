import { ConfigProvider, message } from "antd";
import { Provider } from "react-redux";
import store from "./redux/store";
import Router from "./routers/Router";

message.config({
  top: 30,
  duration: 2,
  maxCount: 3,
  rtl: true,
  prefixCls: "my-message",
});

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextHeading: "#F15E2B",
        },
        components: {},
      }}
    >
      <Provider store={store}>
        <Router />
      </Provider>
    </ConfigProvider>
  );
}

export default App;
