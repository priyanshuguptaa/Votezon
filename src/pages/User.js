import React, { Component } from "react";
import ElectionNavBar from "../components/ElectionNavBar";
import { Container, Form, Button } from "react-bootstrap";
import Election from "../ethereum/election";
import web3 from "../ethereum/web3";
import { withRouter } from "react-router-dom";
import SpecificNavBar from "../components/SpecificNavBar";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      electionContract: {},
      account: "",
      pageLoading: false,
      candidateName: "",
      candidateVoterId: "",
      loading: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const election = await Election(this.props.match.params.address);
    const [account] = await web3.eth.getAccounts();
    const user = await election.methods.voters(account).call();
    console.log(user);
    if (user.name !== "") {
      window.alert("You are a registered user. you cannot register again");
      this.props.history.push(`/elections`);
      return;
    }

    this.setState({ electionContract: election, account: account });
  }

  async onSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    await this.state.electionContract.methods
      .addVoter(this.state.candidateName, this.state.candidateVoterId, "xxxxx")
      .send({ from: this.state.account });
    window.alert("registration successful");
    this.setState({ loading: false });
    this.props.history.push("/elections");
  }

  render() {
    return (
      <>
        <ElectionNavBar />
        <Container>
          <Form onSubmit={this.onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label> Name of voter</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg. Omkar Sharma"
                onChange={(event) =>
                  this.setState({ candidateName: event.target.value })
                }
                value={this.state.candidateName}
                required
              />
              <Form.Label>Enter Voter Id</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg. 245312"
                onChange={(event) =>
                  this.setState({ candidateVoterId: event.target.value })
                }
                value={this.state.candidateVoterId}
                required
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

export default withRouter(User);
