import throttle from "lodash/throttle";
import { loadState, saveState } from "./localStorage";
import { createStore } from "redux";
import { todoApp } from "./reducers";

const configureStore = () => {
  const store = createStore(todoApp, loadState());

  store.subscribe(
    throttle(() => {
      saveState({
        todos: store.getState().todos
      });
    }, 1000)
  );
  return store;
};

export default configureStore;
