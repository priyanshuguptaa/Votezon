import React, { Component } from "react";
import ElectionNavBar from "../components/ElectionNavBar";
import ManageElections from "../ethereum/manageElections";
import Election from "../ethereum/election";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../style/Elections.css";

export class Elections extends Component {
  constructor(props) {
    super(props);
    this.state = { elections: [] };
  }

  async componentDidMount() {
    const elections = await ManageElections.methods
      .getDeployedElections()
      .call();

    const nameandAddress = await Promise.all(
      elections.map(async (address) => {
        const contract = await Election(address);
        const name = await contract.methods.electionName().call();

        return { address: address, name: name };
      })
    );

    this.setState({ elections: nameandAddress });
    console.log("debug", nameandAddress);
  }

  renderElections = (election) => {
    return (
      <Col key={election.address} className="mt-4">
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>{election.name}</Card.Title>
            <Card.Text>Address: {election.address}</Card.Text>
            <LinkContainer to={`/elections/${election.address}`}>
              <Button variant="primary">Go to Election</Button>
            </LinkContainer>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  render() {
    return (
      <>
        <ElectionNavBar />
        <LinkContainer to="/createnewelections">
          <Button variant="primary" className="add-election mt-1">
            Add Elections
          </Button>
        </LinkContainer>
        <Container>
          <Row xs={1} md={2} className="g-4 mt-2">
            {this.state.elections.map(this.renderElections)}
          </Row>
        </Container>
      </>
    );
  }
}

export default Elections;
