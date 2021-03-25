import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import Searching from "../../Searching";
import NewsList from "./NewsList";
import Axios from "axios";

export default function News({ isAdmin }) {
  const [news, setNews] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  useEffect(() => {
    getAllNews();
  }, []);

  const getAllNews = () => {
    setLoading(true);
    Axios.get("/api/news/all")
      .then((res) => res.data)
      .then((news) => {
        if (news.length === 0) {
          setEmpty(true);
          setLoading(false);
        } else {
          setEmpty(false);
          setNews(news);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div>
      <List>
        {isLoading ? (
          <Searching />
        ) : isEmpty ? (
          <div>К сожалению, новостей пока нет :(</div>
        ) : (
          <NewsList news={news} isAdmin={isAdmin} getAllNews={getAllNews} />
        )}
      </List>
    </div>
  );
}
