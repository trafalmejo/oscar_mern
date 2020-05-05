import { combineReducers } from "redux";
import projectReducer from "./projectReducer";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";

export default combineReducers({
  project: projectReducer,
  error: errorReducer,
  auth: authReducer,
});
