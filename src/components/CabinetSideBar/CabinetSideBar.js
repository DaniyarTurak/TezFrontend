import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import Axios from "axios";
import topics from "../../data/sidebar";
import rules from "../../rbacRules";
import Navigation from "./Navigation";
import { ContinuousColorLegend } from "react-vis";



const ConvertRoles = (roles) => {
  try {
    return roles.map((role) => {
      let caption = "";
      switch (role) {
        case "0": {
          caption = "aladin";
          break;
        }
        case "1": {
          caption = "director";
          break;
        }
        case "2": {
          caption = "accountant";
          break;
        }
        case "3": {
          caption = "supplier";
          break;
        }
        case "4": {
          caption = "admin";
          break;
        }
        case "5": {
          caption = "pointHead";
          break;
        }
        case "6": {
          caption = "revisor";
          break;
        }
        case "7": {
          caption = "holder";
          break;
        }
        case "8": {
          caption = "catman";
          break;
        }
        default:
          caption = "";
      }
      return {
        id: role,
        caption,
      };
    });
  } catch (e) {
    return roles;
  }
};
class CabinetSideBar extends Component {

  // test = () => {
  //   const companies_recon = [38, 56, 57, 68, 69, 81, 78, 98, 231, 241, 269, 96, 2];
  //   const comp_id = parseInt(JSON.parse(sessionStorage.getItem("isme-company-data")).id) ?
  //     parseInt(JSON.parse(sessionStorage.getItem("isme-company-data")).id) : 0;
  //   if (!companies_recon.includes(comp_id)) {
  //     topics = topics_norecon;
  //   }
  // }

  state = {
    user: JSON.parse(sessionStorage.getItem("isme-user-data")) || null,
    accessBars: {},
    adminPermissions: null,
  };
  
  componentWillMount() {
    // this.test();
    document.body.setAttribute("style", "background-color:#f4f4f4 !important");
    Axios.get("/api/erpuser/info")
      .then((res) => res.data)
      .then((user) => {
        this.setState({ user });
        sessionStorage.setItem("isme-user-data", JSON.stringify(user));
      })
      .catch((err) => {
        console.log(err);
      });

    this.setState({ accessBars: this.getAccessBars(this.props.userRoles) });
  }

  setPermissions = (userRoles) => {
    this.setState({ accessBars: this.getAccessBars(userRoles) });
  };

  getAccessBars = (userRoles) => {
    userRoles = ConvertRoles(userRoles);
    let accessBars = {};
    let adminPermissions = [];
    userRoles.forEach((role) => {
      if (role.id !== "1") {
        const permissions = rules[role.caption];
        if (permissions) {
          permissions.static.reduce((result, detail, idx) => {
            result[detail] = detail;
            return result;
          }, accessBars);
        }
      }
      else {
        adminPermissions = rules[role.caption].static;
      }
    });
    if(userRoles.some(role => role.id==='8' || role.id==='5')) {
      adminPermissions.push("receive")
    } else {
      let indices = []
        let index = adminPermissions.indexOf("receive")
        while (index !== -1) {
          indices.push(index)
          index = adminPermissions.indexOf("receive", index + 1);
          adminPermissions.splice(index, 1)
        }
    }
    if (accessBars["*"]) return accessBars;

    if (adminPermissions.length !== 0) {
      let isAnyAdminPermissions = false;
      adminPermissions.forEach((value, indx) => {
        if (accessBars[value]) {
          adminPermissions[indx] = "";
        } else isAnyAdminPermissions = true;
      });
      if (!isAnyAdminPermissions) return { "*": "*" };
      this.setState({ adminPermissions });
    }
    return accessBars;
  };

  Can = (page) => {
    const { adminPermissions, accessBars } = this.state;
    if (adminPermissions)
      return !adminPermissions.includes(page) ? true : false;
    if (accessBars["*"]) return true;
    return accessBars[page] ? true : false;
  };

  showTab = (index) => {
    topics.map((tab, ind) => {
      return (tab.status =
        ind === index ? (tab.status === "active" ? "" : "active") : tab.status); //''
    });
    this.setState({ topics });
  };

  changeReportMode = (e) => {
    this.setState({ reportMode: e });
  };

  render() {
    const { newsLoaded } = this.props;
    const { reportMode } = this.state;
    return (
      <Fragment>
        <div className="sidebar-content">
          <ul className="sidebar-nav">
            <NavLink to="/usercabinet">
              <li style={{ display: "flex", padding: "10px 0px" }}>
                <div className="company-logo" />
                <p style={{ margin: "auto 0px" }}>Tez Portal</p>
              </li>
            </NavLink>

            {this.Can("general") && (
              <NavLink activeClassName="nav-active" to="/usercabinet/general">
                <li className="sidebar-brand">
                  {this.state.user && this.state.user.name}
                  <p className="hint">
                    {this.state.user && this.state.user.companyname}
                  </p>
                </li>
              </NavLink>
            )}

            {topics.map((topic) =>
              !topic.group
                ? this.Can(
                  topic.route.substr(
                    0,
                    topic.route.indexOf("/") !== -1
                      ? topic.route.indexOf("/")
                      : topic.route.length
                  )
                ) && (
                  <NavLink
                    key={topic.id}
                    activeClassName="nav-active"
                    to={`/usercabinet/${topic.route}`}
                  >
                    <li>{topic.name}</li>
                  </NavLink>
                )
                : this.Can(
                  topic.group[0].route.substr(
                    0,
                    topic.group[0].route.indexOf("/") !== -1
                      ? topic.group[0].route.indexOf("/")
                      : topic.group[0].route.length
                  )
                ) && (
                  <Fragment key={topic.id}>
                    <li
                      className="group-tab"
                      onClick={() => this.showTab(topic.id)}
                    >
                      {topic.groupName}
                      <i
                        className={`${topic.status === "active" ? "up" : "down"
                          }`}
                      ></i>
                    </li>
                    <ul
                      className={`subgroups-container ${topic.status === "active" ? "slide-down" : "slide-up"
                        }`}
                    >
                      {topic.group.map(
                        (subgroup, ind) =>
                          this.Can(
                            subgroup.route.substr(
                              subgroup.route.indexOf("/") + 1
                            )
                          ) && (
                            //если путь "ревизия" он будет в неё же и обращаться, иначе будет пробовать зайти в "/usercabinet/другойпуть"
                            <Navigation
                              key={ind}
                              subgroup={subgroup}
                              ind={ind}
                              reportMode={reportMode}
                              changeReportMode={this.changeReportMode}
                              newsLoaded={() => newsLoaded()}
                            />
                          )
                      )}
                    </ul>
                  </Fragment>
                )
            )}

            {this.Can("esf") && (
              <NavLink activeClassName="nav-active" to="/usercabinet/esf">
                <li>ЭСФ</li>
              </NavLink>
            )}

            <NavLink activeClassName="nav-active" to="/usercabinet/news">
              <li>Новости</li>
            </NavLink>

            <hr style={{ backgroundColor: "#f0f0f0" }} />
            <NavLink activeClassName="nav-active" to="/usercabinet/changepass">
              <li>Сменить пароль</li>
            </NavLink>

            <NavLink to="/signout">
              <li>Выход</li>
            </NavLink>
          </ul>
        </div>
      </Fragment>
    );
  }
}

export default CabinetSideBar;
