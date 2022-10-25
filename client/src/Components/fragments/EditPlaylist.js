import React, { Fragment, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditPlaylist({ playlist, username }) {
  const [newname, setNewName] = useState(playlist.name);
  const [playlistname, setPlaylistName] = useState(playlist.name);
  const [pid, setPid] = useState(playlist.pid);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setNewName(playlist.name);
    setShow(false);
  }

  const handleShow = () => setShow(true);

  const updateName = async (e) => {
    e.preventDefault();
    try {
      const body = { username, newname, playlistname, pid };
      const myHeaders = new Headers();
      myHeaders.append("Content-type", "application/json");
      const response = await fetch(
        "http://localhost:5000/user/playlist/modifyname",
        {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify(body),
        }
      );
      const jsonData = await response.json();
      if (jsonData != null) {
        setShow(false);
        window.location = "/home/profile";
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <Fragment>
      <Button variant="warning" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Playlist Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            value={newname}
            onChange={(e) => setNewName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateName}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
