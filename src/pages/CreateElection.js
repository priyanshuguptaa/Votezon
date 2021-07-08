import React, { Component } from "react";
import ElectionNavBar from "../components/ElectionNavBar";
import { Container, Form, Button } from "react-bootstrap";
import ManageElection from "../ethereum/manageElections";
import web3 from "../ethereum/web3";

class CreateElection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      electionName: "",
      loading: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    const [account] = await web3.eth.getAccounts();
    await ManageElection.methods
      .createElections(this.state.electionName)
      .send({ from: account });
    window.alert("election created successfully!!");
    this.setState({ loading: false, electionName: "" });
  }

  render() {
    return (
      <>
        <ElectionNavBar />
        <Container>
          <h3>Create new election</h3>
          <Form onSubmit={this.onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label> Name of Election</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(event) =>
                  this.setState({ electionName: event.target.value })
                }
                value={this.state.electionName}
              />
            </Form.Group>
            <Button type="submit" disabled={this.state.loading}>
              submit
            </Button>
          </Form>
        </Container>
      </>
    );
  }
}

export default CreateElection;
