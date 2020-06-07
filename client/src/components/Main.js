import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import ResendConfirmation from "./ResendConfirmation";
import ResetPassword from "./ResetPassword";

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/forgotpassword" component={ForgotPassword} />
      <Route exact path="/resend-confirmation" component={ResendConfirmation} />
      <Route exact path="/reset-password/:token" component={ResetPassword} />
      {/* <Route path="/api/auth/resetpassword/:token" component={ResetPassword} /> */}
    </Switch>
  </main>
);

export default Main;
