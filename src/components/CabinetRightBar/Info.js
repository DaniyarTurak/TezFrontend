import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Link from "@material-ui/core/Link";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { pink, lime, deepPurple } from "@material-ui/core/colors";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import BugReportIcon from "@material-ui/icons/BugReport";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import DialogContent from "@material-ui/core/DialogContent";

const LinkBehavior = React.forwardRef((props, ref) => (
  <RouterLink ref={ref} to="/getting-started/installation/" {...props} />
));

const useStyles = makeStyles((theme) => ({
  deepPurple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  lime: {
    color: theme.palette.getContrastText(lime[500]),
    backgroundColor: lime[500],
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
  subtitle2: {
    fontSize: 12,
  },
  appBar: {
    backgroundColor: "#17a2b8",
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export default function Info({ deleteNews, news, closeNews, modalIsOpen }) {
  const classes = useStyles();

  return (
    <Dialog
      onClose={closeNews}
      open={modalIsOpen}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Новости TEZ Portal
          </Typography>
          <IconButton
            onClick={closeNews}
            edge="end"
            color="inherit"
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent dividers="true">
        <List>
          <UniqueList news={news} deleteNews={(id) => deleteNews(id)} />
        </List>
        <Typography align="center" className={classes.subtitle2}>
          Подсказка: чтобы больше не видеть уведомление о новости, просмотрите
          её.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

const UniqueList = ({ news, deleteNews }) => {
  const classes = useStyles();
  return news.map((item) => {
    const { id, category, ...itemProps } = item;
    return (
      <ListItem key={id}>
        <ListItemAvatar>
          <Avatar
            className={
              category === 0
                ? classes.pink
                : category === 1
                ? classes.lime
                : classes.deepPurple
            }
          >
            {category === 0 ? (
              <BugReportIcon />
            ) : category === 1 ? (
              <NotificationsIcon />
            ) : (
              <AnnouncementIcon />
            )}
          </Avatar>
        </ListItemAvatar>
        <div
          style={{
            display: "flex",
            flex: "1",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            component={LinkBehavior}
            to={"/usercabinet/news/" + id}
            color="inherit"
            style={{ display: "flex" }}
          >
            {itemProps.header}

            <p
              style={{
                textDecoration: "underline",
                fontStyle: "italic",
                marginLeft: "1rem",
                color: "#007bff",
              }}
            >
              Читать далее...
            </p>
          </Link>
        </div>
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => deleteNews(id)}
            edge="end"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  });
};
