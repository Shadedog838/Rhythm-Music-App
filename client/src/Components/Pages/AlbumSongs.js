import { Avatar } from "@material-ui/core";
import Button from "react-bootstrap/Button";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "react-bootstrap/Dropdown";
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
  const [playlists, setPlaylists] = useState([]);

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

  const playAllSongs = async () => {
    const albumid = album.album_id;
    try {
      const body = { username, albumid };
      const myHeaders = new Headers();
      myHeaders.append("Content-type", "application/json");
      const response = await fetch("http://localhost:5000/user/album/play", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });
      const jsonData = await response;
      toast.success("Song data has been recorded");
    } catch (err) {
      console.error(err.message);
    }
  };

  const getPlaylist = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/playlists/${username}`
      );
      const jsonData = await response.json();
      console.log(jsonData);
      if (jsonData.length != 0) {
        setPlaylists(jsonData);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const addToPlaylist = async (pid, sid, name) => {
    const body = { pid, sid };
    const myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json");
    try {
      const response = await fetch(
        "http://localhost:5000/user/playlist/addsong",
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(body),
        }
      );
      const jsonData = await response.json();
      console.log(jsonData);
      toast.success("Song has been added to " + name);
    } catch (err) {
      toast.error("Song is already in playlist");
      console.error(err.message);
    }
  };


  useEffect(() => {
    getSongs();
  }, []);

  useEffect(() => {
    getPlaylist();
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
            <Button className="btn btn-success mb-2" onClick={playAllSongs}>
              Play all Songs
            </Button>
            <table border="1" frame="void" rules="rows">
              <thead>
                <tr>
                  <th>Track #</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Length</th>
                  <th>Play</th>
                  <th>Add to Playlist</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={songs.indexOf(song)}>
                    <td>{song.track_number}</td>
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
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle className="pointer" variant="success">
                          <FontAwesomeIcon icon={solid("plus-square")} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {playlists.map((playlist) => (
                            <Dropdown.Item
                              onClick={() =>
                                addToPlaylist(
                                  playlist.pid,
                                  song.sid,
                                  playlist.name
                                )
                              }
                              key={playlists.indexOf(playlist)}
                            >
                              {playlist.name}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
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
