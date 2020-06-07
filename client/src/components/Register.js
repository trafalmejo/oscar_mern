import React, { Component } from "react";
import { Form, Alert, FormGroup } from "reactstrap";
import { register } from "../actions/authActions";
import { clearErrors } from "../actions/errorAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Register extends Component {
  state = {
    name: "",
    lastname: "",
    email: "",
    password: "",
    password2: "",
    msg: null,
  };
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };
  componentDidMount() {
    // store.dispatch(loadUser());
  }
  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      //Check for register error
      if (error.id === "REGISTER_FAIL") {
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
    const { name, lastname, email, password, password2 } = this.state;

    if (password != password2) {
      this.setState({ msg: "Passwords don't match" });
      return;
    }
    //Create new USER
    const user = {
      name,
      lastname,
      email,
      password,
    };
    //Attempt to Login
    this.props.register(user);
  };

  render() {
    return (
      <div className="container">
        <div className="card o-hidden border-0 shadow-lg my-5">
          <div className="card-body p-0">
            <div className="row">
              <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
              <div className="col-lg-7">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">
                      Create an Account!
                    </h1>
                  </div>
                  {this.state.msg ? (
                    <Alert color="danger">{this.state.msg}</Alert>
                  ) : null}
                  <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                      <div className="form-group row">
                        <div className="col-sm-6 mb-3 mb-sm-0">
                          <input
                            type="name"
                            id="name"
                            name="name"
                            className="form-control form-control-user"
                            placeholder="Enter Name"
                            onChange={this.onChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <input
                            type="lastname"
                            id="lastname"
                            name="lastname"
                            className="form-control form-control-user"
                            placeholder="Enter Lastname"
                            onChange={this.onChange}
                          />
                        </div>
                      </div>
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
                      <div className="form-group row">
                        <div className="col-sm-6 mb-3 mb-sm-0">
                          <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control form-control-user"
                            placeholder="Enter Password"
                            onChange={this.onChange}
                          />{" "}
                        </div>
                        <div className="col-sm-6">
                          <input
                            type="password"
                            id="password2"
                            name="password2"
                            className="form-control form-control-user"
                            placeholder="Confirm Password"
                            onChange={this.onChange}
                          />{" "}
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-user btn-block"
                      >
                        Register
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
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { register, clearErrors })(Register);
