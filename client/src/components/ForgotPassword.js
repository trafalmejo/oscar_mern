import { Form, Alert, FormGroup } from "reactstrap";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { sendResetPasswordToken } from "../actions/authActions";
import { clearErrors } from "../actions/errorAction";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import store from "../store";

class ForgotPassword extends Component {
  state = {
    email: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    sendResetPasswordToken: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };
  componentDidMount() {
    // store.dispatch(loadUser());
  }
  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    console.log(error);
    if (error !== prevProps.error) {
      //Check for register error
      this.setState({ msg: error.msg });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const { email } = this.state;
    //Create new USER
    const user = {
      email,
    };
    //Attempt to Login
    this.props.sendResetPasswordToken(user);
  };
  render() {
    if (this.props.isAuthenticated) return <Redirect to="/dashboard" />;

    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-2">
                          Forgot Password
                        </h1>
                        <p className="mb-4">
                          We get it, stuff happens. Just enter your email
                          address below and we'll send you a link to reset your
                          password!
                        </p>
                      </div>
                      {this.state.msg ? (
                        <Alert color="danger">{this.state.msg}</Alert>
                      ) : null}
                      <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                          <div className="form-group">
                            <input
                              type="email"
                              className="form-control form-control-user"
                              id="email"
                              name="email"
                              aria-describedby="email"
                              placeholder="Enter Email Address..."
                              onChange={this.onChange}
                            />
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary btn-user btn-block"
                          >
                            Send me a reset link
                          </button>
                        </FormGroup>
                      </Form>
                      <hr />
                      <div className="text-center">
                        <a className="small" href="register">
                          Create an Account!
                        </a>
                      </div>
                      <div className="text-center">
                        <a className="small" href="/">
                          Already have an account? Login!
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, {
  sendResetPasswordToken,
  clearErrors,
})(ForgotPassword);
