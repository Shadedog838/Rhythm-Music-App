import React, { Fragment, useEffect, useState } from 'react'
import { Avatar } from "@material-ui/core";

import "./css/Playlist.scss";
import "../assets/scss/MusicListContainer.scss";

export default function Billboard() {
  const [songs, setSongs] = useState([]);

  const getSongs = async () => {
    try {
      const response = await fetch("http://localhost:5000/song/topsongs30");
      const jsonData = await response.json();
      console.log(jsonData);
      if (jsonData.length != 0) {
        setSongs(jsonData);
      }
    } catch (err) {
      console.error(err.message);
    }
  }


  useEffect(() => {
    getSongs();
  }, [])

  return (
    <Fragment>
      <div className='Playlist'>
        <div className='top-playlist'>
          <Avatar
            variant={"rounded"}
            src={require("../assets/img/billboard.png")}
            style={{ width: "150px", height: "150px" }}
          ></Avatar>
          <div className='playlist-detail'>
            <h3>Billboard</h3>
          </div>
        </div>
        <div className='bottom-playlist'>
          <div className='container'>
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
                {songs.map((song) => (
                  <tr key={songs.indexOf(song)}>
                    <td>
                      {songs.indexOf(song) + 1}
                    </td>
                    <td>
                      {songs}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
