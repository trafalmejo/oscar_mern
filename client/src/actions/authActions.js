import axios from "axios";
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
} from "./types";
import { returnErrors } from "./errorAction";

//Check token and load User
//Dispatch = async request.
//getState
export const loadUser = () => (dispatch, getState) => {
  //User loading
  dispatch({
    type: USER_LOADING,
  });
  console.log(tokenConfig(getState));
  axios
    .post("api/auth/user", tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    )
    .catch((err) => {
      console.log("cactched");
      console.log(err);
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};
//RegisterUser
export const register = ({ name, lastname, email, password }) => (dispatch) => {
  //headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  //Request body
  const body = JSON.stringify({ name, lastname, email, password });

  axios
    .post("/api/users", body, config)
    .then((res) =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};
//Setup config / headers and token
export const tokenConfig = (getState) => {
  //Get Token from Local Storage
  const token = getState().auth.token;

  //headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  //If tokem, add to headers
  if (token) {
    config.headers["x_auth_token"] = token;
  }

  return config;
};

//Login User
export const login = ({ email, password }) => (dispatch) => {
  //headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  //Request body
  const body = JSON.stringify({ email, password });

  axios
    .post("/api/auth", body, config)
    .then((res) =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
      );
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

//Loggout
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};
