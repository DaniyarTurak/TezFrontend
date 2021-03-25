// import axios from "axios";

// export const AUTHENTICATED = "authenticated_user";
// export const UNAUTHENTICATED = "unauthenticated_user";
// export const AUTHENTICATION_ERROR = "authentication_error";

// const URL = "/auth";

// export function authError(CONST, error) {
//   return {
//     type: CONST,
//     payload: error
//   };
// }

// export function signInAction({ username, password }, history) {
//   return async dispatch => {
//     try {
//       const res = await axios.post(`${URL}/signin`, { username, password });
//       dispatch({ type: AUTHENTICATED });
//       localStorage.setItem("token", res.data.accessToken);
//       history.push("/usercabinet");
//     } catch (error) {
//       dispatch(authError(AUTHENTICATION_ERROR, "Неверный логин или пароль"));
//     }
//   };
// }

// export function signOutAction() {
//   localStorage.clear();
//   sessionStorage.clear();
//   return {
//     type: UNAUTHENTICATED
//   };
// }
