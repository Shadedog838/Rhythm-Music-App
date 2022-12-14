import React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import { Skeleton } from "@material-ui/lab";
import { ThemeContext } from "../../Theme";
import MusicListConatiner from "../fragments/MusicListConatiner";
import TopBar from "../fragments/TopBar";
import SideBar from "../fragments/SideBar";
import "../Pages/css/Home.scss";
import Profile from "./Profile";
import Album from "./Album";
import PlaylistSongs from "./PlaylistSongs";
import AlbumSongs from "./AlbumSongs";
import Billboard from "./Billboard";
import Recommend from "./Recommend";

const getCurrPage = (pathName) => {
  switch (pathName) {
    case "/home":
      return <MusicListConatiner />;
    case "/home/search":
      return <Search />;
    case "/home/profile":
      return <Profile />;
    case "/home/albums":
      return <Album />
    case "/home/profile/playlist":
      return <PlaylistSongs />
    case "/home/album/songs":
      return <AlbumSongs />
    case "/home/billboard":
      return <Billboard />
    case "/home/recommend":
      return <Recommend />
    default:
      return null;
  }
};

export default function Home({ setAuth }) {
  const navigate = useNavigate();
  const setauth = setAuth;
  const [page, setCurrPage] = useState(<MusicListConatiner />);
  const [username, setUsername] = useState("");
  let pathname = window.location.pathname;
  const useStyle = useContext(ThemeContext);

  const getUsername = () => {
    if (localStorage.getItem("user") === null) {
      navigate("/login");
    }
    setUsername(localStorage.getItem("user"));
  };
  useEffect(() => {
    setCurrPage(getCurrPage(pathname));
  }, [pathname]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    getUsername();
  }, []);

  return (
    <div style={useStyle.component} className="home-conatiner">
      {!loaded ? (
        <div className="home-skeleton">
          <Skeleton animation={"wave"} variant={"rect"} height={"100vh"} />
        </div>
      ) : (
        <>
          <TopBar username={username} setAuth={setAuth} />
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
