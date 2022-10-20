import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro";

import "../assets/scss/MusicListContainer.scss";


export default function MusicListConatiner() {
  const [songs, setSongs] = useState([]);
  const [limit, setLimit] = useState(10);

  const getSongs = async () => {
    try {
      const response = await fetch("http://localhost:5000/song");
      const jsonDate = await response.json();
      setSongs(jsonDate);
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

  const loadMore = () => {
    setLimit(limit + 10);
  };

  useEffect(() => {
    getSongs();
  }, []);

  console.log(songs);
  return (
    <>
      <Fragment>
        <table border="1" frame="void" rules="rows">
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
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
                  <td>{convertMsToMinuteSeconds(song.length)}</td>
                  <td>{song.times_played}</td>
                  <td>
                    <FontAwesomeIcon icon={solid("play-circle")} />
                  </td>
                  <td>
                    <FontAwesomeIcon icon={solid("plus-square")} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="text-center">
          <Button className="btn btn-success btn-block w-25 mt-3 mb-3" onClick={loadMore}>
            Load More
          </Button>
        </div>
      </Fragment>
    </>
  );
}
