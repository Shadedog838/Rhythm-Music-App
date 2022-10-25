import React, { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "react-bootstrap/Dropdown";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import Button from "react-bootstrap/Button";


export default function Album() {
  const [albums, setAlbums] = useState([]);
  const [limit, setLimit] = useState(10);
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

  const loadMore = () => {
    setLimit(limit + 10);
  };

  useEffect(() => {
    getAlbums();
  }, []);
  return (
    <>
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
                  <td>{album.album}</td>
                  <td>{album.artist}</td>
                  <td>
                    <FontAwesomeIcon icon={solid("plus-square")} />
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
    </>
  );
}
