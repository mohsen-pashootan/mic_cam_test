import React, { useState } from "react";
import "./assets/sass/app.scss";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import Home from "./container/home/index";

export const store = configureStore();

function App() {
  const [modalTest, setModaltest] = useState();

  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}

export default App;
