import React, { Fragment, useEffect, useState } from "react";
import "./css/Profile.scss";
import Grade from "grade-js";
import { Avatar } from "@material-ui/core";
import { PlaylistPlay } from "@material-ui/icons";
import CreatePlaylist from "../fragments/CreatePlaylist";
import EditPlaylist from "../fragments/EditPlaylist";

export default function Profile() {
  const [username, setUsername] = useState(localStorage.getItem("user"));
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    Grade(document.querySelectorAll(".gradient-wrap"));
  });

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
      console.log(jsonData);
      // toast.success(name + " has been deleted!");
      window.location = "/home/profile";
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getPlaylist();
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
            <h3>Playlist</h3>
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
                    <td>{playlist.name}</td>
                    <td>{playlist.total_songs}</td>
                    <td>{playlist.total_time}</td>
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
        </div>
      </div>
    </Fragment>
  );
}
