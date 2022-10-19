import React, { Fragment, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import "./css/Login.scss";

export default function Login() {
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
      <h1 className="mt-5 text-center">Login</h1>
      <Form
        className=""
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <Row className="mb-3">
          <Form.Group
            className="mx-auto"
            as={Col}
            md="4"
            controlId="validationUsername"
          >
            <Form.Label>Username:</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Username"
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group
            className="mx-auto"
            as={Col}
            md="4"
            controlId="validationPassword"
          >
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <div className="text-center">
          <Button className="btn btn-success btn-block w-25" type="submit">Login</Button>
          <p>
            Don't have an account? <Link to="/register">register</Link>
          </p>
        </div>
      </Form>
    </Fragment>
  );
}
