import { Form, Alert, FormGroup } from "reactstrap";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { login, loadUser } from "../actions/authActions";
import { clearErrors } from "../actions/errorAction";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import store from "../store";

class Login extends Component {
  state = {
    email: "",
    password: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };
  componentDidMount() {
    store.dispatch(loadUser());
  }
  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      //Check for register error
      console.log(error);
      if (error.id === "LOGIN_FAIL") {
        console.log(error.msg.msg);
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
        const params = new URLSearchParams(this.props.location.search);
        const tags = params.get("msg");
        this.setState({ msg: tags });
      }
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    //Create new USER
    const user = {
      email,
      password,
    };
    //Attempt to Login
    this.props.login(user);
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
                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                      </div>
                      {this.state.msg ? (
                        <Alert color="danger">{this.state.msg}</Alert>
                      ) : null}
                      <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                          <div className="form-group">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="form-control form-control-user"
                              placeholder="Enter Email"
                              onChange={this.onChange}
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type="password"
                              id="password"
                              name="password"
                              className="form-control form-control-user"
                              placeholder="Enter Password"
                              onChange={this.onChange}
                            />
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary btn-user btn-block"
                          >
                            Login
                          </button>
                        </FormGroup>
                      </Form>
                      <hr />
                      <div className="text-center">
                        <a className="small" href="forgotpassword">
                          Forgot Password?
                        </a>
                      </div>
                      <div className="text-center">
                        <a className="small" href="register">
                          Create an Account!
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

export default connect(mapStateToProps, { login, clearErrors, loadUser })(
  Login
);
