import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import CabinetBody from "./CabinetBody";
import Alert from "react-s-alert";
import Info from "./Info";

export default function CabinetRightBar({
  mode,
  action,
  userRoles,
  type,
  newsLoading,
  history,
  location,
}) {
  const [modalIsOpen, setModalOpen] = useState(false);
  const [news, setNews] = useState([]);

  useEffect(() => {
    getCurrentNews();
  }, []);

  const getCurrentNews = () => {
    Axios.get("/api/news/current")
      .then((res) => res.data)
      .then((news) => {
        if (news.length > 0) {
          setModalOpen(true);
          sessionStorage.setItem("news", true);
          setNews(news);
        } else setModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteNews = (news_id) => {
    Axios.post("/api/news/delete_flag", { news_id })
      .then((res) => res.data)
      .then((res) => {
        if (res.code === "success" && res.text) {
          getCurrentNews();
        } else {
          return Alert.error("Возникла непредвиденная ошибка", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeNews = () => {
    setModalOpen(false);
  };

  return (
    <Fragment>
      {(mode === "changepass" && (
        <CabinetBody
          mode={mode}
          action={action}
          userRoles={userRoles}
          type={type}
          history={history}
          location={location}
        />
      )) || (
        <div className="b-cab-right">
          <div className="b-cab-right-menu">
            {newsLoading && (
              <Info
                modalIsOpen={modalIsOpen}
                news={news}
                deleteNews={(id) => deleteNews(id)}
                closeNews={closeNews}
              />
            )}
            <CabinetBody
              mode={mode}
              action={action}
              userRoles={userRoles}
              type={type}
              history={history}
              location={location}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}
