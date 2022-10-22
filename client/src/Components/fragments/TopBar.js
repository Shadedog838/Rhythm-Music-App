import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../Theme";
import SearchSharpIcon from "@material-ui/icons/SearchSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import LogoIcon from "./Logo";
import Button from "react-bootstrap/Button";
import "../assets/scss/TopBar.scss";



export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState({});
  const [attribute, setAttribute] = useState("s.title");
  const [condition, setCondition] = useState("");
  const searchLink = useRef();

  const handleAttribute = (e) => {
    setAttribute(e.target.value);
  };

  const handleCondition = (e) => {
    setCondition(e.target.value);
  };

  const handleSearchQuery = (e) => {
    e.preventDefault();
    if (searchQuery !== null) searchLink.current.click();
  };

  const useStyle = useContext(ThemeContext);
  return (
    <nav style={useStyle.component}>
      <LogoIcon />

      <p className="item">Search By:</p>
      <div className="item select">
        <Form.Select aria-label="search-select" onChange={handleAttribute}>
          <option value="s.title">Title</option>
          <option value="a.name">Artist</option>
          <option value="al.name">Album</option>
          <option value="g.name">Genre</option>
        </Form.Select>
      </div>
      <div className="SearchBar">
        <Form onSubmit={handleSearchQuery} className="d-flex">
          <Link to={"/home/search"}  ref={searchLink} state={{
            "attribute": attribute,
            "condition": condition
          }}/>
          <Form.Control
            type="search"
            placeholder="Search"
            className="search-container"
            aria-label="Search"
            onChange={handleCondition}
          />
          <Button className="ms-2" variant="outline-success" type="submit">Search</Button>
        </Form>
      </div>
      <div className="item">
        <p>You are signed in as "ndvsn"</p>
      </div>
    </nav>
  );
}

