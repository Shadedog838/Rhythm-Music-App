import React, { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";

export default function Album() {
  const [albums, setAlbums] = useState([]);
  const [limit, setLimit] = useState(10);
  const [username, setUsername] = useState(localStorage.getItem("user"));
  const [playlists, setPlaylists] = useState([]);

  const getAlbums = async () => {
    try {
      const response = await fetch("http://localhost:5000/song/albums");
      const jsonData = await response.json();
      console.log(jsonData);
      setAlbums(jsonData);
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

  const addToPlaylist = async (pid, album, name) => {
    const body = { username, pid, album };
    const myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json");
    try {
      const response = await fetch(
        "http://localhost:5000/user/playlist/album/add",
        {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify(body),
        }
      );
      const jsonData = await response.json();
      console.log(jsonData);
      toast.success("Album has been added to " + name);
    } catch (err) {
      console.error(err.message);
    }
  };

  const loadMore = () => {
    setLimit(limit + 10);
  };

  useEffect(() => {
    getAlbums();
  }, []);

  useEffect(() => {
    getPlaylist();
  }, []);
  return (
    <>
      {albums.length !== 0 ? (
        <Fragment>
          <table border="1" frame="void" rules="rows">
            <thead>
              <tr>
                <th>Album Name</th>
                <th>Artist Name</th>
                <th>Add to Playlist</th>
              </tr>
            </thead>
            <tbody>
              {albums
                .filter((album) => albums.indexOf(album) < limit)
                .map((album) => (
                  <tr key={albums.indexOf(album)}>
                    <td>
                      <Link className="text-white" to={"/home/album/songs"} state={album}>
                        {album.album}
                      </Link>
                    </td>
                    <td>{album.artist}</td>
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
                                  album.album_id,
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
      ) : (
        <h2>No result to display</h2>
      )}

      <ToastContainer />
    </>
  );
}
