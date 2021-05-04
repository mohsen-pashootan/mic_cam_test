import { combineReducers } from "redux";
import selectDeviceStatus from "./userDevices/reducers";

const rootReducer = combineReducers({
  selectDeviceStatus,
});

export default rootReducer;
