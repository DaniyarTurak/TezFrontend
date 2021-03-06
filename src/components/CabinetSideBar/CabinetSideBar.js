import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import Axios from "axios";
import Topics from "../../data/sidebar";
import rules from "../../rbacRules";
import Navigation from "./Navigation";
import { isThisSecond } from "date-fns";
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import FilterVintageTwoToneIcon from '@mui/icons-material/FilterVintageTwoTone';

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
    marketing: false,
    topics: Topics,
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
      } else {
        adminPermissions = rules[role.caption].static;
      }
      if (role.id === "5") {
        adminPermissions.push("acceptworkorder");
      }
    });
    // if (userRoles.some(role => role.id === '1' || role.id === '8' || role.id === '2')) {
    //     this.setState({ topics: Topics })
    // } else {
    //     let updatedTopics = this.state.topics.filter(topic => topic.groupName !== "?????????????????? ?? ??????????????????????")
    //     this.setState({ topics: updatedTopics })
    // }
    // if (userRoles.some(role => role.id === '8' || role.id === '5')) {
    //     adminPermissions.push("receive", "productsweight")
    // } else {
    //     adminPermissions = adminPermissions.filter(permission => permission !== "receive" && permission !== "productsweight")
    // }

    // if (accessBars["*"]) return accessBars;

    // if (adminPermissions.length !== 0) {
    //     let isAnyAdminPermissions = false;
    //     adminPermissions.forEach((value, indx) => {
    //         if (accessBars[value]) {
    //             adminPermissions[indx] = "";
    //         } else isAnyAdminPermissions = true;
    //     });
    //     if (!isAnyAdminPermissions) return { "*": "*" };
    //     this.setState({ adminPermissions });
    // }

    // return accessBars;
  };

  Can = (page) => {
    const userAccesses =
      JSON.parse(sessionStorage.getItem("isme-user-accesses")) || [];
    if (page.code) {
      return userAccesses.some((access) => access.code == page.code);
    } else {
      return userAccesses.some((access) => access.category == page);
    }
  };

  showTab = (index) => {
    Topics.map((tab, ind) => {
      return (tab.status =
        ind === index ? (tab.status === "active" ? "" : "active") : tab.status); //''
    });
    this.setState({ Topics });
  };

  changeReportMode = (e) => {
    this.setState({ reportMode: e });
  };
  getAccessPages = (group) => {
    return group.some(this.Can);
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
                <p style={{ margin: "auto 0px" }}>Tez Portal 
                {/* <LocalFloristIcon style={{position: "absolute", top: "21px", right: "127px"}} /> */}
                </p> 
              </li>
            </NavLink>
            <NavLink activeClassName="nav-active" to="/usercabinet/general">
              <li className="sidebar-brand">
                {this.state.user && this.state.user.name}
                <p className="hint">
                  {this.state.user && this.state.user.companyname}
                </p>
              </li>
            </NavLink>

            {this.state.topics.map((topic) =>
              !topic.group
                ? this.Can(topic.name) && (
                    <NavLink
                      key={topic.id}
                      activeClassName="nav-active"
                      to={`/usercabinet/${topic.route}`}
                    > 
                      <li>{topic.name}</li>
                      {/* <FilterVintageTwoToneIcon /> */}
                    </NavLink>
                  )
                : this.getAccessPages(topic.group) && (
                    <Fragment key={topic.id}>
                      <li
                        className="group-tab"
                        onClick={() => this.showTab(topic.id)}
                      >
                        {topic.groupName}
                        <i
                          className={`${
                            topic.status === "active" ? "up" : "down"
                          }`}
                        ></i>
                      </li>
                      <ul
                        className={`subgroups-container ${
                          topic.status === "active" ? "slide-down" : "slide-up"
                        }`}
                      >
                        {topic.group.map((subgroup, ind) => (
                          //???????? ???????? "??????????????" ???? ?????????? ?? ?????? ???? ?? ????????????????????, ?????????? ?????????? ?????????????????? ?????????? ?? "/usercabinet/????????????????????"
                          <Navigation
                            key={ind}
                            subgroup={subgroup}
                            ind={ind}
                            reportMode={reportMode}
                            changeReportMode={this.changeReportMode}
                            newsLoaded={() => newsLoaded()}
                            disabled={!this.Can(subgroup)}
                          />
                        ))}
                      </ul>
                    </Fragment>
                  )
            )}
            {this.Can("??????") && (
              <NavLink activeClassName="nav-active" to="/usercabinet/esf">
                <li>??????</li>
              </NavLink>
            )}

            <NavLink activeClassName="nav-active" to="/usercabinet/news">
              <li>??????????????</li>
            </NavLink>

            <hr style={{ backgroundColor: "#f0f0f0" }} />
            <NavLink activeClassName="nav-active" to="/usercabinet/changepass">
              <li>?????????????? ????????????</li>
            </NavLink>

            <NavLink to="/signout">
              <li>??????????</li>
            </NavLink>
          </ul>
        </div>
      </Fragment>
    );
  }
}

export default CabinetSideBar;
