import Axios from "axios";

export default {
  setupInterceptors: () => {
    Axios.interceptors.response.use(
      response => {
        const token = response.headers["x-refresh-token"];
        if (token) {
          // console.log(token);
          localStorage.setItem("token", token);
          Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
        return response;
      },
      error => {
        if (error.response.status === 401) {
          console.log("EXPIRED TOKEN!");
          sessionStorage.clear();
          // localStorage.clear();
          if (
            window.location.pathname === "/enterrevision" ||
            window.location.pathname === "/revision" ||
            window.location.pathname === "/revision/params"
          ) {
            localStorage.removeItem("revisionToken");
          } else {
            localStorage.removeItem("token");
          }
          if (
            window.location.pathname !== "/" &&
            window.location.pathname !== "/demo" &&
            window.location.pathname !== "/enterrevision"
          )
            if (
              window.location.pathname === "/revision" ||
              window.location.pathname === "/revision/params"
            )
              window.location = "/enterrevision";
            else window.location = "/";
        }
        return Promise.reject(error);
      }
    );
  }
};
