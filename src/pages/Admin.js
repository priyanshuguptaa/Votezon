import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ElectionNavBar from "../components/ElectionNavBar";
import { Container, Card, Form, Button } from "react-bootstrap";
import Election from "../ethereum/election";
import web3 from "../ethereum/web3";
import { create } from "ipfs-http-client";
import election from "../ethereum/election";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      electionContract: {},
      account: "",
      electionObj: {},
      candidateName: "",
      buffer: null,
      loading: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  async componentDidMount() {
    const election = await Election(this.props.match.params.address);

    const owner = await election.methods.ownerOfElection().call();

    const [account] = await web3.eth.getAccounts();

    const electionSummary = await election.methods.getSummary().call();

    const summary = {
      name: electionSummary[0],
      owner: electionSummary[1],
      candidatesCount: parseInt(electionSummary[2]),
      votersCount: parseInt(electionSummary[3]),
      electionCompleted: electionSummary[4],
    };

    this.setState({
      electionContract: election,
      account: account,
      electionObj: summary,
    });

    if (owner !== account) {
      window.alert("You are not the owner of election");
      this.props.history.push("/elections");
      return;
    }
  }

  async onSubmit(event) {
    event.preventDefault();

    this.setState({ loading: true });

    const ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });

    const hash = await ipfs.add(this.state.buffer);
    await this.state.electionContract.methods
      .addCandidates(this.state.candidateName, hash.path)
      .send({ from: this.state.account });
    window.alert("candidate added successfully");
    this.setState({ loading: false });
  }

  captureFile(event) {
    event.preventDefault();

    const file = event.target.files[0];

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
    };
  }

  async changeStatus() {
    await this.state.electionContract.methods
      .finalizeVoting()
      .send({ from: this.state.account });

    // this.props.history.push(`/admin/${this.props.match.params.address}`);
    window.location.reload();
    console.log("redirect");
  }

  render() {
    return (
      <>
        <ElectionNavBar />
        <Container>
          <Card className="text-center mt-2">
            <Card.Header>
              <h3>Admin Panel</h3>
            </Card.Header>
            <Card.Body>
              <Card.Title>{this.state.electionObj.name}</Card.Title>
              <Card.Text>Created by: {this.state.electionObj.owner}</Card.Text>
              <Card.Text>
                Number of Candidates: {this.state.electionObj.candidatesCount}
              </Card.Text>
              <Card.Text>
                People voted: {this.state.electionObj.votersCount}
              </Card.Text>
              <Card.Text>
                Status:{" "}
                {this.state.electionObj.electionCompleted
                  ? "stopped"
                  : "ongoing"}
              </Card.Text>
            </Card.Body>
          </Card>

          <div>
            <span>Election Status</span>
            <Button onClick={this.changeStatus}>
              {this.state.electionObj.electionCompleted ? "stopped" : "ongoing"}
            </Button>
          </div>

          <h3>Add Candidate</h3>
          <Form onSubmit={this.onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label> Name of Candidate</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg. Omkar Sharma"
                onChange={(e) =>
                  this.setState({ candidateName: e.target.value })
                }
                value={this.state.candidateName}
                required
              />
              <Form.Label>Upload Image of Candidate</Form.Label>
              <Form.Control type="file" required onChange={this.captureFile} />
            </Form.Group>
            <Button type="submit" disabled={this.state.loading}>
              {this.state.loading ? "processing.." : "submit"}
            </Button>
          </Form>
        </Container>
      </>
    );
  }
}

export default withRouter(Admin);
