import Axios from "axios";

export const RequiredField = (input) => {
  const mask = /[^ ]/;
  if (!mask.test(input)) return "В поле не могут быть пробелы";
  if (input) return undefined;
  else return "Поле обязательно для заполнения";
};

export const RequiredSelect = (input) =>
  input
    ? input.length <= 0
      ? "Поле обязательно для заполнения"
      : undefined
    : "Поле обязательно для заполнения";

export const ValidationEmail = (input) => {
  // const mask = /^.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
  const mask = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!mask.test(input)) return "Невалидный email";
};

export const ValidateIDN = (input) => {
  if (input && isNaN(Number(input)))
    return "ИИН/БИН должен состоять только из цифр!";
  if (input.length !== 12) return "Длина ИИН/БИН должна быть равна 12!";
};

export const LessThanZero = (input) => {
  if (+input < 0) return "Значение не может быть меньше 0";
};

export const LessThanTwo = (input) => {
  if (+input < 2) return "Значение не может быть меньше 2";
};

export const NotEqualZero = (input) => {
  if (+input === 0) return "Значение не может быть равно 0";
};

export const passwordLength = (input) => {
  if (input.length < 6) return "Длина пароля не может быть меньше 6 символов";
};

export const NotLessThan4 = (input) => {
  if (input.length < 4)
    return "Наименование компании не может быть меньше 4 символов";
};

export const MoreThanZero = (input) => {
  if (input.length < 1) return "Наименование атибута не может быть равно нулю";
};

export const NoMoreThan10 = (input) => {
  if (input && input.length > 10) return "Не более 10 символов";
};

export const NoMoreThan13 = (input) => {
  if (input && input.length > 14) return "Не более 14 символов";
};

export const NoMoreThan16 = (input) => {
  if (input && input.length > 16) return "Не более 16 символов";
};

export const matchPasswords = (confirm, allValues) =>
  allValues.user_password !== confirm ? "Пароли не совпадают" : undefined;

export const CheckEmail = (input) => {
  Axios.get("/api/user/exist", {
    params: {
      email: input,
    },
  }).then((res) => {
    console.log(res);
  });
};
