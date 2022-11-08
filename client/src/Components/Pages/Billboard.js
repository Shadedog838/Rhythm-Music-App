import React, { Fragment, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Avatar } from "@material-ui/core";

import "./css/Playlist.scss";
import "../assets/scss/MusicListContainer.scss";

export default function Billboard() {
  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const [limit, setLimit] = useState(10);

  const getSongs = async () => {
    try {
      const response = await fetch("http://localhost:5000/song/topsongs30");
      const jsonData = await response.json();
      console.log(jsonData);
      if (jsonData.length !== 0) {
        setSongs(jsonData);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getGenres = async () => {
    try {
      const response = await fetch("http://localhost:5000/song/topgenre5");
      const jsonData = await response.json();
      console.log(jsonData);
      if (jsonData.length !== 0) {
        setGenres(jsonData);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const loadMore = () => {
    setLimit(limit + 10);
  };

  useEffect(() => {
    getSongs();
    getGenres();
  }, []);

  return (
    <Fragment>
      <div className="Playlist">
        <div className="top-playlist">
          <Avatar
            variant={"rounded"}
            src={require("../assets/img/billboard.png")}
            style={{ width: "150px", height: "150px" }}
          ></Avatar>
          <div className="playlist-detail">
            <h3>Billboard</h3>
          </div>
        </div>
        <div className="bottom-playlist">
          <div className="container">
            <h3>Top 50 Most Popular Songs</h3>
            <table border="1" frame="void" rules="rows">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Last 30 Days</th>
                  <th>Listen #</th>
                </tr>
              </thead>
              <tbody>
                {songs
                  .filter((song) => songs.indexOf(song) < limit)
                  .map((song) => (
                    <tr key={songs.indexOf(song)}>
                      <td>{songs.indexOf(song) + 1}</td>
                      <td>{song.title}</td>
                      <td>{song.play}</td>
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
          <div className="container mt-3">
            <h3>Top 5 Most Popular Genres</h3>
            <table border="1" frame="void" rules="rows">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Genre</th>
                  <th>Listen #</th>
                </tr>
              </thead>
              <tbody>
                {genres.map((genre) => (
                  <tr key={genres.indexOf(genre)}>
                    <td>{genres.indexOf(genre) + 1}</td>
                    <td>{genre.name}</td>
                    <td>{genre.play}</td>
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
