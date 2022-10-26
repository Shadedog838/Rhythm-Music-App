import { Avatar } from "@material-ui/core";
import Button from "react-bootstrap/Button";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./css/Playlist.scss";

export default function PlaylistSongs() {
  const { state } = useLocation();
  if (!state) {
    window.location.reload();
  }
  const [playlist, setPlaylist] = useState(state ? state : null);
  const [albums, setAlbums] = useState(new Map());
  const [songs, setSongs] = useState([]);

  const loadAlbums = () => {
    for (let song of songs) {
      console.log(song);
    }
  }

  const getSongs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user/playlist/${playlist.pid}`);
      const jsonData = await response.json();
      setSongs(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };


  useEffect(() => {
    getSongs();
  }, [])

  useEffect(() => {
    loadAlbums();
  }, [songs])

  return (
    <Fragment>
      <div className="Playlist">
        <div className="top-playlist">
          <Avatar
            variant={"rounded"}
            src={require("../assets/img/playlist.jpg")}
            style={{ width: "150px", height: "150px" }}
          ></Avatar>
          <div className="playlist-detail">
            <h3>{playlist.name}</h3>
          </div>
        </div>
        <div className="bottom-playlist">
          <div className="container">
            <Button className="btn btn-success">Play all Songs</Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
