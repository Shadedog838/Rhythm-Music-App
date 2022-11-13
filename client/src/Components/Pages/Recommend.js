import React, { Fragment, useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "react-bootstrap/Dropdown";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { ToastContainer, toast } from "react-toastify";
import Button from "react-bootstrap/Button";

import "./css/Playlist.scss";
import "../assets/scss/MusicListContainer.scss";

export default function Recommend() {
  const [songs, setSongs] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("user"));
  const [playlists, setPlaylists] = useState([]);
  const [limit, setLimit] = useState(10);

  const getSongs = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/recommendation/${username}`
      );
      const jsonData = await response.json();
      console.log(jsonData);
      if (jsonData.length != 0) {
        setSongs(jsonData);
      }
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
      console.error(err.message);
    }
  };

  const playSong = async (sid) => {
    setTimeout(5000);
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
    } catch (err) {
      console.error(err.message);
      toast.error("Something went wrong!");
    }
  };

  const loadMore = () => {
    setLimit(limit + 10);
  };

  useEffect(() => {
    getSongs();
    getPlaylist();
  }, []);
  return (
    <Fragment>
      <div className="Playlist">
        <div className="top-playlist">
          <Avatar
            variant={"rounded"}
            src={require("../assets/img/recommend.png")}
            style={{ width: "150px", height: "150px" }}
          ></Avatar>
          <div className="playlist-detail">
            <h3>For You</h3>
          </div>
        </div>
        <div className="bottom-playlist">
          <div className="container">
            <h3>Songs Recommended For You</h3>
            <table border="1" frame="void" rules="rows">
              <thead>
                <tr>
                  <th>title</th>
                  <th>Artist</th>
                  <th>Play</th>
                  <th>Add to Playlist</th>
                </tr>
              </thead>
              <tbody>
                {songs
                  .filter((song) => songs.indexOf(song) < limit)
                  .map((song) => (
                    <tr key={songs.indexOf(song)}>
                      <td>{song.title}</td>
                      <td>{song.name}</td>
                      <td className="pointer">
                        <FontAwesomeIcon
                          onClick={() => playSong(song.sid)}
                          icon={solid("play-circle")}
                        />
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            className="pointer"
                            variant="success"
                          >
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
            {songs.length > limit ? (
              <div className="text-center">
                <Button
                  className="btn btn-success btn-block w-25 mt-3 mb-3"
                  onClick={loadMore}
                >
                  Load More
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <ToastContainer/>
    </Fragment>
  );
}
