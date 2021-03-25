// import axios from "axios";

// export const SUCCESS = "success";
// export const ERROR = "error";

// const URL = "/api/company";

// export function callback(CONST, error) {
//   return {
//     type: CONST,
//     payload: error,
//   };
// }

// export const editGeneralInfo = (props) => {
//   return function (dispatch) {
//     axios
//       .post(`${URL}/manage`, props)
//       .then(() => {
//         dispatch(callback(SUCCESS, "Изменения сохранены"));
//       })
//       .catch((err) => {
//         const text =
//           err.response.data.code === "internal_error"
//             ? "Возникла ошибка при обработке вашего запроса. Мы уже работаем над решением. Попробуйте позже"
//             : err.response.data.text;

//         dispatch(callback(ERROR, text));
//       })
//       .catch((err) => {
//         console.log("error", err);
//         dispatch(callback(ERROR, "error"));
//       });
//   };
// };
