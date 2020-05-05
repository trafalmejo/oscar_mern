import React, { Component } from "react";

class Register extends Component {
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
                  <form className="user" action="/users/register" method="POST">
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="name"
                          id="name"
                          name="name"
                          className="form-control form-control-user"
                          placeholder="First Name"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="lastname"
                          id="lastname"
                          name="lastname"
                          className="form-control form-control-user"
                          placeholder="Last Name"
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
                      />
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control form-control-user"
                          placeholder="Create Password"
                        />{" "}
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="password"
                          id="password2"
                          name="password2"
                          className="form-control form-control-user"
                          placeholder="Confirm Password"
                        />{" "}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                      Register
                    </button>
                  </form>
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

export default Register;
