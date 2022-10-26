import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Fragment } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { ToastContainer, toast } from "react-toastify";

import "../assets/scss/MusicListContainer.scss";
import "react-toastify/dist/ReactToastify.css";

export default function Search() {
  const { state } = useLocation();
  if (!state) {
    window.location.reload();
  }
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [attribute, setAttribute] = useState(state ? state.attribute : "");
  const [condition, setCondition] = useState(state ? state.condition : "");
  const [limit, setLimit] = useState(10);
  const [username, setUsername] = useState(localStorage.getItem("user"));

  const getSongs = async () => {
    try {
      console.log(attribute, condition);
      const response = await fetch(
        `http://localhost:5000/song/search/${attribute}/${condition}`
      );
      const jsonData = await response.json();
      console.log(jsonData)
      setSongs(jsonData);
    } catch (err) {
      console.log(err.message);
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

  const loadMore = () => {
    setLimit(limit + 10);
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

  useEffect(() => {
    console.log("State updated" + state.attribute + " " + state.condition);
    setAttribute(state ? state.attribute : "");
    setCondition(state ? state.condition : "");
  }, [state]);

  useEffect(() => {
    getSongs();
  }, [attribute, condition]);

  useEffect(() => {
    getPlaylist()
  }, [])

  return (
    <>
      {songs.length !== 0 ? (
        <div className="music-list-container">
          <Fragment>
            <table border="1" frame="void" rules="rows">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Genre</th>
                  <th>Lenth</th>
                  <th>Listen #</th>
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
                      <td>{song.album_name}</td>
                      <td>{song.genre}</td>
                      <td>{convertMsToMinuteSeconds(song.length)}</td>
                      <td>{song.times_played}</td>
                      <td>
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
            <div className="text-center">
              <Button
                className="btn btn-success btn-block w-25 mt-3 mb-3"
                onClick={loadMore}
              >
                Load More
              </Button>
            </div>
          </Fragment>
        </div>
      ) : (
        <h2>No result to display!</h2>
      )}
      <ToastContainer />
    </>
  );
}
