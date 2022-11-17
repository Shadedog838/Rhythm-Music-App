import React, { Fragment, useEffect, useState } from "react";
import "./css/Profile.scss";
import Grade from "grade-js";
import { Avatar } from "@material-ui/core";
import CreatePlaylist from "../fragments/CreatePlaylist";
import EditPlaylist from "../fragments/EditPlaylist";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Collapse from "react-bootstrap/Collapse";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const [username, setUsername] = useState(localStorage.getItem("user"));
  const [playlists, setPlaylists] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [attribute, setAttribute] = useState("");
  const [topArtists, setTopArtists] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [users, setUsers] = useState([]);
  const [openArtist, setOpenArtist] = useState(false);
  const [openTopSongs, setOpenTopSongs] = useState(false);
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowing, setOpenFollowing] = useState(false);

  useEffect(() => {
    Grade(document.querySelectorAll(".gradient-wrap"));
  });

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

  const getPlaylist = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/playlists/${username}`
      );
      const jsonData = await response.json();
      if (jsonData.length != 0) {
        setPlaylists(jsonData);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const deletePlaylist = async (pid, name) => {
    try {
      const body = { username, pid };
      const myHeaders = new Headers();
      myHeaders.append("Content-type", "application/json");
      const response = await fetch(
        "http://localhost:5000/user/playlist/delete",
        {
          method: "DELETE",
          headers: myHeaders,
          body: JSON.stringify(body),
        }
      );
      const jsonData = await response.json();
      if (playlists.length < 2) {
        window.location.reload();
      } else {
        getPlaylist();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getFollowers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/followers/${username}`
      );
      const jsonData = await response.json();
      if (jsonData.length != 0) {
        setFollowers(jsonData);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getFollowing = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/followedby/${username}`
      );
      const jsonData = await response.json();
      if (jsonData.length != 0) {
        setFollowing(jsonData);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getUsers = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/user/usersearch/${attribute}`
      );
      const jsonData = await response.json();
      if (jsonData.length !== 0) {
        setUsers(jsonData);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const followUser = async (username1, username2, user) => {
    if (following.filter((e) => e.follows === username1).length > 0) {
      toast.error("You already follow " + username1);
    } else {
      try {
        const body = { username1, username2 };
        const myHeaders = new Headers();
        myHeaders.append("Content-type", "application/json");
        const response = await fetch("http://localhost:5000/user/follow", {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(body),
        });
        const jsonData = await response;
        toast.success("You are now following " + username1);
        setTimeout(2000);
        getFollowing();
        getFollowers();
      } catch (err) {
        toast.error("You already follow " + username1);
        console.error(err.message);
      }
    }
  };

  const unFollow = async (username1, username2) => {
    try {
      const body = { username1, username2 };
      const myHeaders = new Headers();
      myHeaders.append("Content-type", "application/json");
      const response = await fetch("http://localhost:5000/user/unfollow", {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify(body),
      });
      const jsonData = await response;
      toast.success("Unfollowed " + username1);
      setTimeout(5000);
      if (following.length < 2) {
        window.location.reload();
      } else {
        getFollowing();
        getFollowers();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getArtists = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/topartists/${username}`
      );
      const jsonData = await response.json();
      if (jsonData.length != 0) {
        setTopArtists(jsonData);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getTopSongsFriends = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/topsongsfriends/${username}`
      );
      const jsonData = await response.json();
      if (jsonData.length != 0) {
        setTopSongs(jsonData);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getArtists();
    getFollowers();
    getFollowing();
    getPlaylist();
    getTopSongsFriends();
  }, []);

  return (
    <Fragment>
      <div className="Profile">
        <div className="top-profile">
          <Avatar
            variant={"rounded"}
            src={require("../assets/img/avatar_profile.jpg")}
            style={{ width: "150px", height: "150px" }}
          ></Avatar>
          <div className="profile-detail">
            <h3>{username}</h3>
          </div>
        </div>
        <div className="bottom-profile">
          <div className="container">
            <Button
              className="collapsible"
              id="artists"
              onClick={() => {
                let elem = document.getElementById("artists");
                elem.classList.toggle("active");
                setOpenArtist(!openArtist);
              }}
              aria-expanded={openArtist}
            >
              Your Top 10 Artists
            </Button>
            <Collapse in={openArtist}>
              <table border="1" frame="void" rules="rows">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Artist</th>
                    <th>Listen #</th>
                  </tr>
                </thead>
                <tbody>
                  {topArtists.map((artist) => (
                    <tr key={topArtists.indexOf(artist)}>
                      <td>{topArtists.indexOf(artist) + 1}</td>
                      <td>{artist.name}</td>
                      <td>{artist.play}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Collapse>
          </div>
          <div className="container mt-3">
            <Button
              className="collapsible"
              id="songs"
              onClick={() => {
                let elem = document.getElementById("songs");
                elem.classList.toggle("active");
                setOpenTopSongs(!openTopSongs);
              }}
              aria-expanded={openTopSongs}
            >
              Top 50 Songs Among Your Friends
            </Button>
            <Collapse in={openTopSongs}>
              <table border="1" frame="void" rules="rows">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Listen #</th>
                  </tr>
                </thead>
                <tbody>
                  {topSongs.map((song) => (
                    <tr key={topSongs.indexOf(song)}>
                      <td>{topSongs.indexOf(song) + 1}</td>
                      <td>{song.title}</td>
                      <td>{song.play}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Collapse>
          </div>
          <div className="container mt-3">
            <h3>Playlist ({playlists.length})</h3>
            <CreatePlaylist />
            <table border="1" frame="void" rules="rows">
              <thead>
                <tr>
                  <th>Name</th>
                  <th># Of Songs</th>
                  <th>Total Duration</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {playlists.map((playlist) => (
                  <tr key={playlists.indexOf(playlist)}>
                    <td>
                      <Link
                        className="text-white"
                        to={"/home/profile/playlist"}
                        state={playlist}
                      >
                        {playlist.name}
                      </Link>
                    </td>
                    <td>{playlist.total_songs}</td>
                    <td>{convertMsToMinuteSeconds(playlist.total_time)}</td>
                    <td>
                      <EditPlaylist playlist={playlist} username={username} />
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          deletePlaylist(playlist.pid, playlist.name)
                        }
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
          <div className="container mt-3">
            <Button
              className="collapsible"
              id="followers"
              onClick={() => {
                let elem = document.getElementById("followers");
                elem.classList.toggle("active");
                setOpenFollowers(!openFollowers);
              }}
              aria-expanded={openFollowers}
            >
              Followers ({followers.length})
            </Button>
            <Collapse in={openFollowers}>
              <table border="1" frame="void" rules="rows">
                <thead>
                  <tr>
                    <th>Followers ({followers.length})</th>
                  </tr>
                </thead>
                <tbody>
                  {followers.map((follower) => (
                    <tr key={followers.indexOf(follower)}>
                      <td>{follower.followers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Collapse>
          </div>
          <div className="container mt-3">
            <Button
              className="collapsible"
              id="following"
              onClick={() => {
                let elem = document.getElementById("following");
                elem.classList.toggle("active");
                setOpenFollowing(!openFollowing);
              }}
              aria-expanded={openFollowing}
            >
              Following ({following.length})
            </Button>
            <Collapse in={openFollowing}>
              <table border="1" frame="void" rules="rows">
                <thead>
                  <tr>
                    <th>Following ({following.length})</th>
                  </tr>
                </thead>
                <tbody>
                  {following.map((follow) => (
                    <tr key={following.indexOf(follow)}>
                      <td>{follow.follows}</td>
                      <td>
                        <Button
                          onClick={() => unFollow(follow.follows, username)}
                          className="btn btn-success"
                        >
                          unfollow
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Collapse>
          </div>
          <div className="container mt-3">
            <h3>Search Users</h3>
            <form className="d-flex mt-2 mb-3 w-50" onSubmit={getUsers}>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setAttribute(e.target.value)}
              />
              <button className="btn btn-success">Find</button>
            </form>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Follow</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={users.indexOf(user)}>
                    <td>{user.username}</td>
                    <td>
                      <Button
                        onClick={() =>
                          followUser(user.username, username, user)
                        }
                        className="btn btn-success"
                      >
                        Follow
                      </Button>
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
