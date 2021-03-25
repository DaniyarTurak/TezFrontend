import React, { useState, useEffect } from "react";
import Axios from "axios";
import Searching from "../../Searching";
import marked from "marked";
import Alert from "react-s-alert";
import "./news.sass";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

marked.setOptions({
  breaks: true,
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    //textAlign: "center",
    color: theme.palette.text.primary,
  },
}));

const LinkBehavior = React.forwardRef((props, ref) => (
  <RouterLink ref={ref} to="/getting-started/installation/" {...props} />
));

const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}">${text}</a>`;
};

renderer.image = function (href, title, text) {
  if (title) {
    var size = title.split("x");
    if (size[1]) {
      size = "width=" + size[0] + " height=" + size[1];
    } else {
      size = "width=" + size[0];
    }
  } else {
    size = "";
  }
  return '<img src="' + href + '" alt="' + text + '" ' + size + ">";
};

export default function NewsInformation({ action, isAdmin }) {
  const [isLoading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [header, setHeader] = useState("");
  const classes = useStyles();

  useEffect(() => {
    getNewsById();
    deleteNewsFromDiary();
  }, []);

  const deleteNewsFromDiary = () => {
    Axios.post("/api/news/delete_flag", { news_id: action })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  };

  const getNewsById = () => {
    setLoading(true);
    Axios.get("/api/news/byId", { params: { id: action } })
      .then((res) => res.data)
      .then((news) => {
        setHeader(news[0].header);
        setContent(news[0].content);
        setCategory(news[0].category);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const rows = content.split("\n").length + 1;

  const onMarkedChange = (e) => {
    setContent(e.target.value);
  };

  const onHeaderChange = (e) => {
    setHeader(e.target.value);
  };

  const updateNews = () => {
    const data = {
      header,
      content,
      news_id: parseInt(action, 0),
    };
    Axios.post("/api/news/update_news", data)
      .then((res) => res.data)
      .then((res) => {
        Alert.success("Новость успешно обновлена", {
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

  return isLoading ? (
    <Searching />
  ) : (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              color="inherit"
              component={LinkBehavior}
              to={isAdmin ? "/adminpage/news/" : "/usercabinet/news/"}
            >
              Новости
            </Link>
            <Link color="inherit">
              {category === 0 ? "Баг" : category === 1 ? "Уведомление" : "Фича"}
            </Link>
            <Typography color="textPrimary"> {header}</Typography>
          </Breadcrumbs>
          <br />
          <Divider />

          {isAdmin && <label>Редактирование заголовка</label>}
          {isAdmin && (
            <input
              type="text"
              value={header}
              className="form-control"
              name="header"
              placeholder="Введите заголовок новости"
              onChange={onHeaderChange}
            />
          )}

          {!isAdmin && <Typography variant="h2">{header}</Typography>}
          {!isAdmin && <Divider />}
        </Grid>

        <Grid item xs={12}>
          {isAdmin && <label>Редактирование новости</label>}
          {isAdmin && (
            <textarea
              type="text"
              className="form-control"
              rows={rows}
              value={content}
              onChange={onMarkedChange}
            ></textarea>
          )}
          {isAdmin && <label style={{ marginTop: "1rem" }}>Превью</label>}
          <div
            className="preview"
            dangerouslySetInnerHTML={{
              __html: marked(content, {
                renderer: renderer,
              }),
            }}
          ></div>
          {isAdmin && (
            <button
              style={{ marginTop: "1rem" }}
              className="btn btn-success"
              onClick={updateNews}
            >
              Сохранить изменения
            </button>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
