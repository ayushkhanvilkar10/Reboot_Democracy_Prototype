import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavBar.css';

const BlogNavbar = () => {
  return (
    <Navbar className="navbar-container" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <h3>Reboot Democracy</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="#about-us" className="nav-link">About Us</Nav.Link>
            <Nav.Link href="#blog" className="nav-link">Blog</Nav.Link>
            <Nav.Link href="#events" className="nav-link">Events</Nav.Link>
            <Nav.Link href="#our-work" className="nav-link">Our Work</Nav.Link>
            <Nav.Link href="#sign-up" className="nav-link">
              <Button variant="outline-light" className="sign-up-btn">Sign Up</Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BlogNavbar;
