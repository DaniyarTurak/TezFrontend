import React, { Fragment, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { withStyles } from '@material-ui/core/styles';
import Moment from 'moment';
import Axios from "axios";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";


const ExpandButton = withStyles((theme) => ({
  root: {
    color: "white",
    backgroundColor: "#28a745",
    '&:hover': {
      backgroundColor: "#008000",
    },
  },
}))(Button);

const CancelButton = withStyles((theme) => ({
  root: {
    color: "black",
    backgroundColor: "#DCDCDC",
    '&:hover': {
      backgroundColor: "#D3D3D3",
    },
  },
}))(Button);

export default function CertificateExpand({ certificate, closeExpand, closeExpandAndReload }) {
  const [expiredate, setExpiredate] = useState(Moment().format("YYYY-MM-DD"));
  const [isLoading, setLoading] = useState(false);
  const [code, setCode] = useState();
  const [isSent, setSent] = useState(false);


  const handleDateChange = (date) => {
    setExpiredate(date);
  };

  const getExpandCertificate = () => {
    setLoading(true);
    setSent(true);
    let code = certificate;
    Axios({
      method: "POST",
      url: "/api/giftcertificates/update_cert_expdate",
      data: { expiredate, code },
    })
      .then((res) => res.data)
      .then((res) => {
        setCode(res.code);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setCode("error");
        setLoading(false);
      });
  }

  return (
    <Fragment>
      <h5>Продление сертификата</h5>
      <hr />
      <Grid container direction="column" justify="center" alignItems="center" >
        <Grid item xs={12}>
          <span style={{ color: "#808080" }}>Номер сертификата:</span>&nbsp;{certificate}
        </Grid>
        <Grid item xs={12}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              label="Продлить до"
              disableToolbar
              variant="inline"
              format="dd.MM.yyyy"
              margin="normal"
              value={expiredate}
              onChange={handleDateChange}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
        {!isSent && <Fragment>
          <ExpandButton onClick={getExpandCertificate} disabled={isLoading}>
            Продлить
        </ExpandButton>
        &emsp;
        <CancelButton onClick={closeExpand}>
            Отмена
        </CancelButton>
        </Fragment>}
        {
          isSent && code === "success" &&
          <Fragment>
            <span style={{ color: "#28a745" }}>Сертификат успешно продлён</span>
            <CancelButton onClick={closeExpandAndReload}>
              Закрыть
        </CancelButton>
          </Fragment>
        }
        {
          isSent && code === "error" &&
          <Fragment>
            <span style={{ color: "#dc3545" }}>При попытке продлить сертификат возникла ошибка</span>
            <CancelButton onClick={closeExpand}>
              Закрыть
        </CancelButton>
          </Fragment>
        }
      </Grid>
    </Fragment>
  );
}
