import React, { useState, useEffect } from "react";
import useComponentWillMount from "../../customHooks/useComponentWillMount";
import Loading from "../../Loading";
import Alert from "react-s-alert";
import ScrollUpButton from "react-scroll-up-button";
import AdminSideBar from "./AdminSideBar";
import AdminRightBar from "./AdminRightBar";
import Axios from "axios";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    background: " #2b333b",
    color: "white",
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  icon: {
    color: "white",
  },
}));

export default function AdminPage({ match, history, location }) {
  const classes = useStyles();
  const theme = useTheme();
  const { mode, action, type } = match.params;

  const [isLoading, setLoading] = useState(false);
  const [isDataLoading, setDataLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("isme-user-data")) || {}
  );

  useEffect(() => {
    setLoading(false);
  }, []);

  useComponentWillMount(() => {
    if (!user.login) {
      Axios.get("/api/erpuser/info")
        .then((res) => res.data)
        .then((res) => {
          sessionStorage.setItem("isme-user-data", JSON.stringify(user));
          setUser(res);
          setDataLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setDataLoading(false);
        });
    } else {
      setDataLoading(false);
    }
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return isLoading || isDataLoading ? (
    <Loading />
  ) : (
    (!isLoading || !isDataLoading) && (
      <div className={classes.root}>
        <Alert stack={{ limit: 1 }} offset={30} />
        <ScrollUpButton />
        <CssBaseline />
        <AppBar
          style={{ background: "#17a2b8" }}
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Tez Portal
            </Typography>
          </Toolbar>
        </AppBar>

        <AdminSideBar
          clsx={clsx}
          user={user}
          classes={classes}
          theme={theme}
          open={open}
          handleDrawerClose={handleDrawerClose}
        />

        <main
          style={{ width: "100vh" }}
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <AdminRightBar
            mode={mode}
            action={action}
            type={type}
            history={history}
            location={location}
            user={user}
          />
        </main>
      </div>
    )
  );
}
