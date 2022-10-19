import React, { Fragment, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import "./css/Login.scss";

export default function Register() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <Fragment>
      <h1 className="mt-5 text-center">Register</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group
            className="mx-auto"
            as={Col}
            md="4"
            controlId="validationFirstname"
          >
            <Form.Label>First name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="First name"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group className="mx-auto" as={Col} md="4" controlId="validationLastname">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Last name"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group className="mx-auto" as={Col} md="4" controlId="validationUsername">
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Username"
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group className="mx-auto" as={Col} md="4" controlId="validationPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group className="mx-auto" as={Col} md="4" controlId="validationCustom04">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Email" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <div className="text-center">
          <Button className="btn btn-success btn-block w-25" type="submit">Register</Button>
          <p>
            Already have an account? <Link to="/login">login</Link>
          </p>
        </div>
      </Form>
    </Fragment>
  );
}
