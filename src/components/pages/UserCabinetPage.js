import React, { useRef, useState } from "react";
import CabinetSideBar from "../CabinetSideBar";
import CabinetRightBar from "../CabinetRightBar";
import Axios from "axios";
import Alert from "react-s-alert";
import ScrollUpButton from "react-scroll-up-button";
import useComponentWillMount from "../customHooks/useComponentWillMount";

export default function UserCabinet({ match, history, location }) {
  const childRef = useRef();
  const [userRoles, setUserRoles] = useState(
    JSON.parse(sessionStorage.getItem("isme-user-grant")) || []
  );
  const [toggled, setToggled] = useState(
    JSON.parse(sessionStorage.getItem("isme-sidebar-toggle")) || {
      isToggled: window.innerWidth > 1366,
    }
  );
  const [newsLoading, setNewsLoading] = useState(true);
  const { mode, action, type } = match.params;

  useComponentWillMount(() => {
    Axios.get("/api/erpuser/user/roles")
      .then((res) => res.data)
      .then((roles) => {
        const userRolesChanged = roles.map((role) => {
          return role.id;
        });

        sessionStorage.setItem(
          "isme-user-grant",
          JSON.stringify(userRolesChanged)
        );
        setUserRoles(userRolesChanged);
        childRef.current.setPermissions(userRolesChanged);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const toggleSidebar = () => {
    const toggledChanged = { isToggled: !toggled.isToggled };
    setToggled(toggledChanged);
    sessionStorage.setItem(
      "isme-sidebar-toggle",
      JSON.stringify(toggledChanged)
    );
  };

  const newsLoaded = () => {
    const news = sessionStorage.getItem("news");
    setNewsLoading(!news);
  };

  return (
    <div id="wrapper" className={`${toggled.isToggled ? "toggled" : ""}`}>
      <Alert stack={{ limit: 1 }} offset={30} />
      <ScrollUpButton />
      <div id="sidebar-wrapper">
        <div className="sidebar-toggle-button" onClick={toggleSidebar}>
          <button
            className={`btn btn-w-icon sidebar-button ${
              toggled.isToggled ? "cross" : "hamburger"
            }`}
          ></button>
        </div>
        <CabinetSideBar
          userRoles={userRoles}
          ref={childRef}
          newsLoaded={newsLoaded}
        />
      </div>
      <div id="page-content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <CabinetRightBar
                newsLoading={newsLoading}
                userRoles={userRoles}
                mode={mode}
                action={action}
                type={type}
                history={history}
                location={location}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
