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

export default function AlbumSongs() {
  const { state } = useLocation();
  if (!state) {
    window.location.reload();
  }

  const [album, setAlbum] = useState(state ? state : null);
  const [songs, setSongs] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("user"));

  const getSongs = async () => {
    console.log(album);
    try {
      const response = await fetch(
        `http://localhost:5000/song/album/${album.album_id}`
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

  useEffect(() => {
    getSongs();
  }, []);

  return (
    <Fragment>
      <div className="Playlist">
        <div className="top-playlist">
          <Avatar
            variant={"rounded"}
            src={require("../assets/img/album.png")}
            style={{ width: "150px", height: "150px" }}
          ></Avatar>
          <div className="playlist-detail">
            <h3>{album.album}</h3>
          </div>
        </div>
        <div className="bottom-playlist">
          <div className="container">
            <Button className="btn btn-success mb-2">Play all Songs</Button>
            <table border="1" frame="void" rules="rows">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Length</th>
                  <th>Play</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={songs.indexOf(song)}>
                    <td>{song.title}</td>
                    <td>{song.artist_name}</td>
                    <td>{song.album_name}</td>
                    <td>{convertMsToMinuteSeconds(song.length)}</td>
                    <td className="pointer">
                      <FontAwesomeIcon
                        onClick={() => playSong(song.sid)}
                        icon={solid("play-circle")}
                      />
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
