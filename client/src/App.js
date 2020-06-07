import React from "react";
import Main from "./components/Main";
import { Provider } from "react-redux";
import store from "./store";

const App = () => (
  <div>
    <Provider store={store}>
      <Main />
    </Provider>
  </div>
);

export default App;
