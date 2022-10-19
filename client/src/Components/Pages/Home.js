import React, { useSyncExternalStore } from "react";
import { useEffect, useState, useContext } from "react";
import { Skeleton } from "@material-ui/lab";
import { ThemeContext } from "../../Theme";
import MusicListConatiner from "../fragments/MusicListConatiner";

export default function Home() {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currMusic, setCurrMusic] = useState(null);

  let pathname = window.location.pathname;
  const useStyle = useContext(ThemeContext);

  const [loaded, setLoaded] = useState(false)
  return (
    <div style={useStyle.component} className="home-conatiner">
      {/* <div> */}
        {/* <Skeleton animation={"wave"} variant={"rect"} height={"100vh"} /> */}
        <MusicListConatiner />
      {/* </div> */}
    </div>
  );
}
