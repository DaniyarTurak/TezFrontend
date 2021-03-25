import Alert from "react-s-alert";

export default function ErrorAlert(err) {
  //Если json ошибка приходит с типом Blob(обычно из сервисов выгрузки в Excel), нужно перевести в читаемый текст:
  if (err.response) {
    if (err.response.data instanceof Blob)
      err.response.data
        .text()
        .then((res) => {
          console.error("ErrorAlert response:", res);
          Alert.error("Ошибка в загружаемом файле:" + res, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 5000,
          });
        })
        .catch();
    else {
      console.error("ErrorAlert response:", err.response.data.text);
      Alert.error(
        err.response
          ? err.response.data.text
            ? err.response.data.text
            : err.response.data.code === "internal_error"
            ? "Возникла ошибка на стороне сервера.[internal_server_error]"
            : Object.keys(err.response.data).length === 0 &&
              err.response.data.constructor === Object
            ? "Возникла ошибка на стороне передачи данных на сервер."
            : err
          : err,
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        }
      );
    }
  } else {
    Alert.error(err, {
      position: "top-right",
      effect: "bouncyflip",
      timeout: 5000,
    });
  }
}
