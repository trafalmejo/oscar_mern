import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "../store";
import { loadUser } from "../actions/authActions";
import AppNavbar from "./AppNavbar";
import ProjectList from "./ProjectList";
import ProjectModal from "./ProjectModal";
import { Container } from "reactstrap";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Dashboard extends Component {
  // componentDidMount() {
  //   store.dispatch(loadUser());
  // }
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
  };
  render() {
    if (!this.props.isAuthenticated) return <Redirect to="/" />;

    return (
      <div className="App">
        <AppNavbar />
        <Container>
          <ProjectModal />
          <ProjectList />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, {})(Dashboard);
