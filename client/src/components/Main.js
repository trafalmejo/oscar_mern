import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/forgotpassword" component={ForgotPassword} />
    </Switch>
  </main>
);

export default Main;
