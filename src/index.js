import { Provider } from "react-redux";
import { TodoApp } from "./components";
import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./configureStore";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById("root")
);
