import React, { useContext } from "react";
import { ThemeContext } from "../../Theme";
import SideBarOptions from "./SideBarOptions";
import AlbumIcon from "@material-ui/icons/Album";
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import PollIcon from '@material-ui/icons/Poll';
import RecommendIcon from '@mui/icons-material/Recommend';
import "../assets/scss/SideBar.scss";

export default function SideBar() {
  const useStyle = useContext(ThemeContext);
  return (
    <aside style={useStyle.component} className={"aside-bar"}>
      <div className="aside-bar-container">
        <p className="p1">
          <span>Navigation</span>
        </p>
        <SideBarOptions
          className="nav-sub"
          Icon={HomeIcon}
          href={"/home"}
          title={"Home"}
        />
        <SideBarOptions
          className="nav-sub"
          Icon={AlbumIcon}
          href={"/home/albums"}
          title={"Albums"}
        />
        <SideBarOptions
          className="nav-sub"
          Icon={PersonIcon}
          href={"/home/profile"}
          title={"Profile"}
        />
        <SideBarOptions
          className="nav-sub"
          Icon={PollIcon}
          href={"/home/billboard"}
          title={"Billboard"}
        />
        <SideBarOptions
          className="nav-sub"
          Icon={RecommendIcon}
          href={"/home/recommend"}
          title={"Recommended"}
        />
      </div>
    </aside>
  );
}
