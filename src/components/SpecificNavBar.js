import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const SpecificNavBar = ({ address }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#home">VoteNow</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to={`/elections/${address}`}>
            <Nav.Link>Election</Nav.Link>
          </LinkContainer>

          <LinkContainer to={`/admin/${address}`}>
            <Nav.Link>profile</Nav.Link>
          </LinkContainer>
          <LinkContainer to={`/admin/${address}`}>
            <Nav.Link>voters</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default SpecificNavBar;
