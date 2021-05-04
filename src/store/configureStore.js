import { createStore } from "redux";
import rootReducer from "../redux/reducer";

const configureStore = () => {
  const store = createStore(rootReducer);
  return store;
};

export default configureStore;
