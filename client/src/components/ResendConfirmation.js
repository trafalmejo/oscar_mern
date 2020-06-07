import { Form, Alert, FormGroup } from "reactstrap";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { resendConfirmation } from "../actions/authActions";
import { clearErrors } from "../actions/errorAction";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import store from "../store";

class ResendConfirmation extends Component {
  state = {
    email: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    resendConfirmation: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };
  componentDidMount() {
    // store.dispatch(loadUser());
  }
  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      //Check for register error
      if (error.id === "LOGIN_FAIL") {
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
    const { email } = this.state;
    //Create new USER
    const user = {
      email,
    };
    //Attempt to Login
    this.props.resendConfirmation(user);
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
                          Confirmation Email
                        </h1>
                        <p className="mb-4">
                          It seems like we sent an email with a link to confirm
                          your email. Please check your spam folder. If you
                          didn't receive the email we can resend it.
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
                            Resend
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

export default connect(mapStateToProps, { resendConfirmation, clearErrors })(
  ResendConfirmation
);
