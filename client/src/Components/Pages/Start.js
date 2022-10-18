import React from "react";
import { Link } from "react-router-dom";
import "./css/Start.scss";
import Logo from "../assets/img/rythm.jpg";

export default function Start() {
  return (
    <section id="main">
      <div className="nav-item">
        <a className="navbar-brand" href="/">
          Rhythm
        </a>
      </div>
      <div className="main-row">
        <div className="main-row-img">
          <img className="rythm-img" src={Logo} alt="" />
        </div>
        <div className="main-row-text">
          <h1>Time To Enjoy Some Music</h1>
          <p>I guaranteed there is a song for you!!</p>
          <Link to={"/home"} className="btn">
            Start Listening To Your Favaorite Songs
          </Link>
        </div>
      </div>
    </section>
  );
}
