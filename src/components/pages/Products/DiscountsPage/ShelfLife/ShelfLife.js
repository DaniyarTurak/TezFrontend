import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CreateShelfs from "./CreateShelfs";
import ExistingShelfs from "./ExistingShelfs";
import alert from "react-s-alert";
import Axios from "axios";
import { Alert, AlertTitle } from "@material-ui/lab";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  button: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
  },
});

let day = [];
let month = [];
for (let i = 0; i <= 31; i++) {
  day.push({ value: i, label: i });
}
for (let i = 0; i <= 12; i++) {
  month.push({ value: i, label: i });
}

export default function ShelfLife() {
  const [shelf, setShelf] = useState([
    {
      displayID: 1,
      from: 0,
      to: 0,
      type: 1,
      discount: 0,
      fromPicker: day,
      toPicker: day,
    },
  ]);
  const [isSubmitting, setSubmitting] = useState(false);
  const classes = useStyles();

  const AlertWarning = (text) => {
    alert.warning(text, {
      position: "top-right",
      effect: "bouncyflip",
      timeout: 2000,
    });
  };

  const handleSubmitShelfs = () => {
    let incorrectPeriodTo = false;
    let incorrectDiscount = false;
    shelf.forEach((e) => {
      if (e.to === 0) {
        incorrectPeriodTo = true;
      } else if (e.discount === 0) {
        incorrectDiscount = true;
      }
    });
    if (incorrectPeriodTo) {
      return AlertWarning("Выставите корректный период окончания!");
    } else if (incorrectDiscount) {
      return AlertWarning("Выставите корректную скидку!");
    } else postDiscounts();
  };

  const postDiscounts = () => {
    setSubmitting(true);
    const expdatediscount = [...shelf];
    Axios.post("/api/expdatediscount/manage", { expdatediscount })
      .then(() => {
        alert.success("Скидка добавлена успешно!", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setSubmitting(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setSubmitting(false);
      });
  };
  return (
    <Fragment>
      <Alert severity="info">
        <AlertTitle>
          <strong>Внимание!</strong>
        </AlertTitle>
        В случае наличия у товара общих скидок (по категории/по бренду/по
        товару), скидка по сроку годности будет применена в любом случае. Вы
        можете настроить применение общих скидок в соответствующем разделе.
      </Alert>
      <div className={classes.button} style={{ color: "#bdbdbd" }}>
        Активные скидки по срокам годности
      </div>
      <ExistingShelfs
        isSubmitting={isSubmitting}
        shelf={shelf}
        setShelf={setShelf}
      />
      <div className={classes.button}>Создать новую скидку</div>
      <CreateShelfs shelf={shelf} setShelf={setShelf} />
      <div className={classes.button}>
        <button
          className="btn btn-outline-info"
          disabled={isSubmitting}
          onClick={handleSubmitShelfs}
        >
          Создать скидки
        </button>
      </div>
    </Fragment>
  );
}
