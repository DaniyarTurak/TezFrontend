import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Link from "@material-ui/core/Link";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { pink, lime, deepPurple } from "@material-ui/core/colors";
import { Link as RouterLink } from "react-router-dom";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Axios from "axios";
import Alert from "react-s-alert";
import BugReportIcon from "@material-ui/icons/BugReport";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AnnouncementIcon from "@material-ui/icons/Announcement";

const LinkBehavior = React.forwardRef((props, ref) => (
  <RouterLink ref={ref} to="/getting-started/installation/" {...props} />
));

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
  lime: {
    color: theme.palette.getContrastText(lime[500]),
    backgroundColor: lime[500],
  },
  deepPurple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

export default function UniqueList({ news, isAdmin, getAllNews }) {
  const classes = useStyles();

  return news.map((item) => {
    const { id, category, ...itemProps } = item;

    const handleDelete = () => {
      const data = {
        news_id: id,
      };

      Axios.post("/api/news/delete_news", data)
        .then((res) => res.data)
        .then((res) => {
          getAllNews();
          Alert.success("Новость успешно удалена!", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          console.log(res);
        })
        .catch((err) => {
          Alert.error(`Возникла ошибка при обрабоке вашего запроса: ${err}`, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          console.log(err);
        });
    };

    return (
      <ListItem key={id} divider>
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
        <Link
          component={LinkBehavior}
          to={`${isAdmin ? "/adminpage/news/" : "/usercabinet/news/"}` + id}
          color="inherit"
          secondary="1"
        >
          <ListItemText
            primary={itemProps.header}
            secondary={Moment(itemProps.date).calendar()}
          />
        </Link>
        {isAdmin && (
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );
  });
}
