import React, { useSyncExternalStore } from "react";
import { useEffect, useState, useContext } from "react";
import { Skeleton } from "@material-ui/lab";
import { ThemeContext } from "../../Theme";
import MusicListConatiner from "../fragments/MusicListConatiner";
import TopBar from "../fragments/TopBar";
import SideBar from "../fragments/SideBar";

export default function Home() {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currMusic, setCurrMusic] = useState(null);

  let pathname = window.location.pathname;
  const useStyle = useContext(ThemeContext);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div style={useStyle.component} className="home-conatiner">
      {
        !loaded ?
        <div>
        <Skeleton animation={"wave"} variant={"rect"} height={"100vh"} />
      </div>
      :
      <>
        <TopBar />
        <section className="home-music-container">
          <div className="sidebar-home">
            <SideBar />
          </div>
        </section>
      </>
      }

    </div>
  );
}
