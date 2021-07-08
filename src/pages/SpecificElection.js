import React, { Component } from "react";
import ElectionNavBar from "../components/ElectionNavBar";
import SpecificNavBar from "../components/SpecificNavBar";
import {
  Container,
  Card,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Election from "../ethereum/election";
import web3 from "../ethereum/web3";
import { withRouter } from "react-router-dom";

class SpecificElection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      electionContract: {},
      electionObj: "",
      candidates: [],
      account: "",
    };
    this.Vote = this.Vote.bind(this);
    this.renderCandidates = this.renderCandidates.bind(this);
  }

  async componentDidMount() {
    const election = await Election(this.props.match.params.address);
    const electionSummary = await election.methods.getSummary().call();
    const electionObj = {
      name: electionSummary[0],
      owner: electionSummary[1],
      candidatesCount: parseInt(electionSummary[2]),
      votersCount: parseInt(electionSummary[3]),
      status: electionSummary[4],
    };
    this.setState({ electionContract: election, electionObj: electionObj });

    const [account] = await web3.eth.getAccounts();

    this.setState({ account: account });

    const candidates = await Promise.all(
      Array(electionObj.candidatesCount)
        .fill()
        .map(async (element, index) => {
          const candidate = await election.methods.candidates(++index).call();
          return {
            name: candidate.name,
            imageHash: candidate.candidateImageHash,
            voteCount: parseInt(candidate.voteCount),
          };
        })
    );
    this.setState({ candidates: candidates });
  }

  async Vote(candidateId) {
    const [account] = await web3.eth.getAccounts();

    const candidateSummary = await this.state.electionContract.methods
      .voters(account)
      .call();

    console.log(candidateSummary);

    if (candidateSummary.name === "") {
      window.alert("Please create your profile");
      return;
    }

    if (candidateSummary.voted) {
      window.alert("You have already voted");
      return;
    }

    if (candidateSummary.name !== "" && candidateSummary.voted === false) {
      await this.state.electionContract.methods
        .giveVote(candidateId + 1)
        .send({ from: account });
    }
    window.alert("You have successfully voted!!");
    this.props.history.push(`/elections/${this.props.match.params.address}`);
  }

  renderCandidates(candidate, index) {
    return (
      <Col key={candidate.imageHash} className="mt-2">
        <Card style={{ width: "18rem" }}>
          <Card.Img
            variant="top"
            src={`https://ipfs.infura.io/ipfs/${candidate.imageHash}`}
          />
          <Card.Body>
            <Card.Title>{candidate.name}</Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroupItem>vote: {candidate.voteCount}</ListGroupItem>
          </ListGroup>
          <Card.Body>
            <Button
              variant="primary"
              size="lg"
              onClick={() => this.Vote(index)}
            >
              vote
            </Button>
          </Card.Body>
        </Card>
      </Col>
    );
  }

  render() {
    return (
      <>
        <SpecificNavBar address={this.props.match.params.address} />
        <Container>
          <Card className="text-center mt-2">
            <Card.Header>Summary</Card.Header>
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
                Status: {this.state.electionObj.owner ? "Ongoing" : "Completed"}
              </Card.Text>
            </Card.Body>
          </Card>

          <LinkContainer to={`/admin/${this.props.match.params.address}`}>
            <Button className="mt-3" variant="primary">
              admin
            </Button>
          </LinkContainer>

          <h5 className="mt-5">Candidates</h5>
          <Container>
            <Row xs={1} md={2} className="g-4 mt-2">
              {this.state.candidates.map(this.renderCandidates)}
            </Row>
          </Container>
        </Container>
      </>
    );
  }
}

export default withRouter(SpecificElection);
