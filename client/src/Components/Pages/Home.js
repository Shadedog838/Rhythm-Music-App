import React, { useSyncExternalStore } from "react";
import { useEffect, useState, useContext } from "react";
import Search from "./Search";
import { Skeleton } from "@material-ui/lab";
import { ThemeContext } from "../../Theme";
import MusicListConatiner from "../fragments/MusicListConatiner";
import TopBar from "../fragments/TopBar";
import SideBar from "../fragments/SideBar";
import "../Pages/css/Home.scss";

const getCurrPage = (pathName) => {
  switch (pathName) {
    case "/home":
      return <MusicListConatiner />;
    case "/home/search":
      return <Search />;
    default:
      return null;
  }
};

export default function Home() {
  const [page, setCurrPage] = useState(<MusicListConatiner />);

  let pathname = window.location.pathname;
  const useStyle = useContext(ThemeContext);
  useEffect(() => {
    setCurrPage(getCurrPage(pathname));
  }, [pathname]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div style={useStyle.component} className="home-conatiner">
      {!loaded ? (
        <div className="home-skeleton">
          <Skeleton animation={"wave"} variant={"rect"} height={"100vh"} />
        </div>
      ) : (
        <>
          <TopBar />
          <section className="home-music-container">
            <div className="sidebar-home">
              <SideBar />
            </div>
            <div className="main-home">{page}</div>
          </section>
        </>
      )}
    </div>
  );
}
