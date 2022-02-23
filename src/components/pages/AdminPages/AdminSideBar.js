import React, { useState, Fragment } from "react";
import { NavLink } from "react-router-dom";
import topics from "../../../data/adminSidebar";

import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import SettingsIcon from '@mui/icons-material/Settings';

export default function AdminSideBar({
  classes,
  open,
  handleDrawerClose,
  theme,
}) {
  const [isDirectory, setDirectory] = useState(false);

  const LinkRef = React.forwardRef((props, ref) => (
    <div ref={ref} className="sidebar-nav-admin">
      <NavLink {...props} activeClassName="nav-active-admin" />
    </div>
  ));
  const handleClick = () => {
    setDirectory(!isDirectory);
  };
  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton
          color="inherit"
          onClick={handleDrawerClose}
          className={classes.menuButton}
        >
          {theme.direction === "ltr" ? (
            <Fragment>
              <ChevronLeftIcon />
            </Fragment>
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>
        {topics.map((topic) => (
          <Fragment key={topic.id}>
            {topic.id !== 3 ? (
              <ListItem
                component={LinkRef}
                // если был нажат "Зарегистрироваться" или "Выход" (id 8 и 12 соответсвенно),
                // то в URL-ле adminpage/ не прописывается.
                to={`/${
                  topic.id !== 8 && topic.id !== 12 && topic.id !== 3
                    ? "adminpage/"
                    : ""
                }${topic.route}`}
                button
                key={topic.id}
              >
                {topic.id === 13 && (
                  <ListItemIcon className={classes.icon}>
                    <ExitToAppIcon />
                  </ListItemIcon>
                )}

                {topic.id === 12 && (
                  <ListItemIcon className={classes.icon}>
                    <LockOpenIcon />
                  </ListItemIcon>
                )}

                <ListItemText primary={topic.name} />
              </ListItem>
            ) : (
              <Fragment>
                <ListItem onClick={handleClick} button key={topic.id}>
                  <ListItemText primary={topic.name} />
                  {isDirectory ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={isDirectory} timeout="auto" unmountOnExit>
                  {topic.group.map((subgroup) => (
                    <ListItem
                      component={LinkRef}
                      to={`/adminpage/${subgroup.route}`}
                      //to={`/adminpage/asddsd`}
                      button
                      key={topic.id}
                      className={classes.nested}
                    >
                      <ListItemText primary={subgroup.name} />
                    </ListItem>
                  ))}
                </Collapse>
              </Fragment>
            )}

            {/* Перед "Зарегистрироваться" нужно поставить divider. 
                    На данный момент предыдущий id = 7 */}
            {topic.id === 7 ? <Divider /> : ""}
          </Fragment>
        ))}
      </List>
    </Drawer>
  );
}
