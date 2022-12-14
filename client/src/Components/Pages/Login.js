import React, { Fragment, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { json, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ setAuth }) {
  const [validated, setValidated] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const { username, password } = inputs;

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    let form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);
    try {
      const body = { username, password };
      const myHeaders = new Headers();
      myHeaders.append("Content-type", "application/json");
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      console.log(jsonData);
      if (jsonData.message == "loggedin") {
        localStorage.setItem("user", jsonData.username);
        setAuth(true);
      } else {
        // console.log("Log in unsuccessful");
        toast.error("Please enter a valid username or password");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="mt-5 text-center text-white">Login</h1>
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
                name="username"
                value={username}
                placeholder="Username"
                onChange={(e) => onChange(e)}
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
            <InputGroup hasValidation>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => onChange(e)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid password.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <div className="text-center">
          <Button className="btn btn-success btn-block w-25" type="submit">
            Login
          </Button>
          <p className="text-white">
            Don't have an account? <Link to="/register">register</Link>
          </p>
        </div>
      </Form>
      <ToastContainer />
    </Fragment>
  );
}
