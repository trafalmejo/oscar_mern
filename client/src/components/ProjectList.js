import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { connect } from "react-redux";
import { getProjects, deleteProject } from "../actions/projectsAction";
import PropTypes from "prop-types";

class ProjectList extends Component {
  componentDidMount() {
    this.props.getProjects();
  }
  onDeleteClick = (id) => {
    this.props.deleteProject(id);
  };
  render() {
    const projects = this.props.project.projects;
    //const {projects} = this.state;
    return (
      <Container>
        <ListGroup>
          <TransitionGroup className="project-list">
            {projects.map(({ _id, name }) => (
              <CSSTransition key={_id} timeout={500} classNames="fade">
                <ListGroupItem>
                  <Button
                    className="remove-btn"
                    color="danger"
                    size="sm"
                    onClick={this.onDeleteClick.bind(this, _id)}
                  >
                    &times;
                  </Button>
                  {name}
                </ListGroupItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>
      </Container>
    );
  }
}
ProjectList.propTypes = {
  getProjects: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  project: state.project,
});

export default connect(mapStateToProps, { getProjects, deleteProject })(
  ProjectList
);
