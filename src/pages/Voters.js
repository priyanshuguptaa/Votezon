import React, { Component } from "react";
import ElectionNavBar from "../components/ElectionNavBar";
import Election from "../ethereum/election";
import { Container, ListGroup } from "react-bootstrap";

class Voters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voters: [],
    };
  }

  async componentDidMount() {
    const election = await Election(this.props.match.params.address);
    const voters = await election.methods.votedCandidatesAddress().call();

    this.setState({ voters: voters });
  }

  render() {
    return (
      <>
        <ElectionNavBar />
        <Container className="mt-5">
          <h3>Voted users</h3>
          <ListGroup>
            {this.state.voters.map((voter) => (
              <ListGroup.Item key={voter}>{voter}</ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      </>
    );
  }
}

export default Voters;
