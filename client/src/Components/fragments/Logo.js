import React from 'react'
import Logo from "../assets/img/rythm.jpg";
import { Link } from "react-router-dom";

export default function LogoIcon() {
  return (
    <div className="logo">
      <Link to={"/home"}>
        <img src={Logo} width={"24px"} alt=""/>
      </Link>
    </div>
  )
}
