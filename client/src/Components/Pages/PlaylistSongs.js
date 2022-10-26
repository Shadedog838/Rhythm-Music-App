import { Avatar } from "@material-ui/core";
import Button from "react-bootstrap/Button";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import "./css/Playlist.scss";
import "../assets/scss/MusicListContainer.scss";

export default function PlaylistSongs() {
  const { state } = useLocation();
  if (!state) {
    window.location.reload();
  }
  const [update, setUpdate] = useState(false);
  const [playlist, setPlaylist] = useState(state ? state : null);
  const [songs, setSongs] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("user"));

  const getSongs = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/playlist/${playlist.pid}`
      );
      const jsonData = await response.json();
      console.log(jsonData);
      setSongs(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0");
  };
  const convertMsToMinuteSeconds = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.round((milliseconds % 60000) / 1000);

    return seconds === 60
      ? `${minutes + 1}:60`
      : `${minutes}:${padTo2Digits(seconds)}`;
  };

  const playSong = async (sid) => {
    const body = { username, sid };
    const myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json");
    try {
      const response = await fetch("http://localhost:5000/song/plays", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      // console.log(jsonData);
      toast.success("Song data has been recorded");
      setTimeout(2000);
      getSongs();
    } catch (err) {
      console.error(err.message);
      toast.error("Something went wrong!");
    }
  };

  const playAllSongs = async () => {
    const pid = playlist.pid;
    const body = { username, pid };
    const myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json");
    try {
      const response = await fetch("http://localhost:5000/user/playlist/play", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });
      const jsonData = await response;
      toast.success("Song data has been recorded");
      setUpdate(true);
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err.message);
    }
  };

  const deleteSong = async (sid) => {
    const pid = playlist.pid;
    console.log(pid, sid);
    const body = { pid, sid };
    const myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json");
    try {
      const response = await fetch(
        "http://localhost:5000/user/playlist/deletesong",
        {
          method: "DELETE",
          headers: myHeaders,
          body: JSON.stringify(body),
        }
      );
      const jsonData = await response.json();
      getSongs();
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getSongs();
  }, [update]);

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
            <Button className="btn btn-success mb-2" onClick={playAllSongs}>
              Play all Songs
            </Button>
            <table border="1" frame="void" rules="rows">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Length</th>
                  <th>Play</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={songs.indexOf(song)}>
                    <td>{song.title}</td>
                    <td>{song.artist}</td>
                    <td>{song.album_name}</td>
                    <td>{convertMsToMinuteSeconds(song.length)}</td>
                    <td className="pointer">
                      <FontAwesomeIcon
                        onClick={() => playSong(song.sid)}
                        icon={solid("play-circle")}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => deleteSong(song.sid)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
}
