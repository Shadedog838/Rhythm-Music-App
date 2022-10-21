import React, { useContext } from "react";
import { ThemeContext } from "../../Theme";
import SideBarOptions from "./SideBarOptions";
import AlbumIcon from "@material-ui/icons/Album";
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';

export default function SideBar() {
  const useStyle = useContext(ThemeContext);
  return (
    <aside style={useStyle.component} className={"aside-bar"}>
      <div className="aside-bar-container">
        <p className={"p1"}>
          <span>Navigation</span>
        </p>
        <SideBarOptions
          className={"lib-sub"}
          Icon={HomeIcon}
          href={"/home"}
          title={"Home"}
        />
        <SideBarOptions
          className={"lib-sub"}
          Icon={AlbumIcon}
          href={"/home/Albums"}
          title={"Albums"}
        />
        <SideBarOptions
          className={"lib-sub"}
          Icon={PersonIcon}
          href={"/home/Profile"}
          title={"Profile"}
        />
      </div>
    </aside>
  );
}
