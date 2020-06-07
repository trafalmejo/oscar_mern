import { Form, Alert, FormGroup } from "reactstrap";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { resetPassword } from "../actions/authActions";
import { clearErrors } from "../actions/errorAction";
import { connect } from "react-redux";

class ResetPassword extends Component {
  state = {
    token: "",
    password: "",
    password2: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    resetPassword: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };
  componentDidMount() {
    // store.dispatch(loadUser());
    this.setState({ token: this.props.match.params.token });
  }
  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      //Check for register error
      if (error.id === "PASSWORD_RESET_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const { token } = this.state;
    const { password } = this.state;
    const { password2 } = this.state;
    if (password != password2) {
      this.setState({ msg: "Passwords don't match" });
      return;
    }
    //Create new USER
    const user = {
      token,
      password,
    };
    //Attempt to Login
    this.props.resetPassword(user);
  };
  render() {
    // if (this.props.isAuthenticated) return <Redirect to="/dashboard" />;

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
                              type="password"
                              className="form-control form-control-user"
                              id="password"
                              name="password"
                              aria-describedby="password"
                              placeholder="Enter Password..."
                              onChange={this.onChange}
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type="password"
                              className="form-control form-control-user"
                              id="password2"
                              name="password2"
                              aria-describedby="password"
                              placeholder="Confirm Password..."
                              onChange={this.onChange}
                            />
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary btn-user btn-block"
                          >
                            Reset Password
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
  resetPassword,
  clearErrors,
})(ResetPassword);
