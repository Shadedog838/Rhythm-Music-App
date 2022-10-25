import React, { Fragment, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Register({setAuth}) {
  const [validated, setValidated] = useState(false);
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    email: "",
  });

  const { firstname, lastname, username, password, email } = inputs;

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    try {
      const body = { firstname, lastname, username, password, email };
      const myHeaders = new Headers();
      myHeaders.append("Content-type", "application/json");
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      console.log(jsonData);
      if (jsonData.message == "created") {
        localStorage.setItem("user", jsonData.username);
        setAuth(true);
      } else {
        toast.error("Account failed to be created user may already exist");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="mt-5 text-center text-white">Register</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group
            className="mx-auto"
            as={Col}
            md="4"
            controlId="validationFirstname"
          >
            <Form.Label>First name</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                required
                type="text"
                name="firstname"
                placeholder="First name"
                value={firstname}
                onChange={(e) => onChange(e)}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group
            className="mx-auto"
            as={Col}
            md="4"
            controlId="validationLastname"
          >
            <Form.Label>Last name</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                required
                type="text"
                name="lastname"
                placeholder="Last name"
                value={lastname}
                onChange={(e) => onChange(e)}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group
            className="mx-auto"
            as={Col}
            md="4"
            controlId="validationUsername"
          >
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => onChange(e)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
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
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => onChange(e)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a password.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group
            className="mx-auto"
            as={Col}
            md="4"
            controlId="validationCustom04"
          >
            <Form.Label>Email</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => onChange(e)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email address.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <div className="text-center">
          <Button className="btn btn-success btn-block w-25" type="submit">
            Register
          </Button>
          <p className="text-white">
            Already have an account? <Link to="/login">login</Link>
          </p>
        </div>
      </Form>
      <ToastContainer />
    </Fragment>
  );
}
