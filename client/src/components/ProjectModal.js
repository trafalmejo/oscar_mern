import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { connect } from "react-redux";
import { addProject } from "../actions/projectsAction";
import PropTypes from "prop-types";

class ProjectModal extends Component {
  state = {
    modal: false,
    name: "",
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      name: this.state.name,
    };
    //Add project via addProject action
    this.props.addProject(newItem);
    //Close modal
    this.toggle();
  };
  render() {
    return (
      <div>
        {this.props.isAuthenticated ? (
          <Button
            color="dark"
            style={{ marginButtoom: "2rem" }}
            onClick={this.toggle}
          >
            Add Project
          </Button>
        ) : (
          <h4 className="mb-3 ml-4">Please Log in to Manage projects</h4>
        )}

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add to Project List</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="project">Porject</Label>
                <Input
                  type="text"
                  name="name"
                  id="project"
                  placeholder="Add Project"
                  onChange={this.onChange}
                />
                <Button color="dark" style={{ marginTop: "2rem" }} block>
                  Add Project
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  project: state.project,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { addProject })(ProjectModal);
