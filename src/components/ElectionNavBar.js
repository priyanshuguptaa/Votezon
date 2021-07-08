import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

const ElectionNavBar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Votezon</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default ElectionNavBar;
