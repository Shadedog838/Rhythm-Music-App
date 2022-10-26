import React, { Fragment, useState } from "react";

export default function CreatePlaylist() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("user"));

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { name, username };
      const myHeaders = new Headers();
      console.log(name);
      myHeaders.append("Content-type", "application/json");
      const response = await fetch(
        "http://localhost:5000/user/createplaylist",
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(body),
        }
      );
      const jsonData = await response;
      window.location = "/home/profile";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <form className="d-flex mt-2 mb-3 w-50" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-success">Create</button>
      </form>
    </Fragment>
  );
}
