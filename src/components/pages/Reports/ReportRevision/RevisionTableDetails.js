import React, { Fragment, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Moment from "moment";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import "moment/locale/ru";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

Moment.locale("ru");

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#17a2b8",
    color: theme.palette.common.white,
    fontSize: ".875rem",
  },
  body: {
    fontSize: ".875rem",
  },
  footer: {
    fontWeight: "bold",
    fontSize: ".875rem",
  },
}))(TableCell);

export default function RevisionTableDetails({
  classes,
  username,
  dateRev,
  backToList,
  revisionDetails,
  parametr,
  setParametr,
  onlyDiff,
  setOnlyDiff,
  revtype,
  revnumber,
  revtypeName
}) {

  const CustomRadio = withStyles({
    root: {
      color: "#17a2b8",
      '&$checked': {
        color: "#28a745",
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

  const [isLoading, setLoading] = useState(false);

  const detailsToExcel = () => {
    console.log(revisionDetails);
    setLoading(true);
    Axios({
      method: "POST",
      url: "/api/report/revision/detailsexcel",
      data: { revisionDetails },
      responseType: "blob",
    })
      .then((res) => res.data)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Ревизия.xlsx`);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  }

  return (
    <Fragment>
      {console.log(revisionDetails)}
      <Grid item xs={8}>
        <Typography>
          Номер ревизии: {revnumber} <br />
          Ревизор: {username} <br />
          Дата ревизии: {dateRev} <br />
          Тип ревизии: {revtype === 2 ? `По бренду (${revtypeName})` :
                    revtype === 3 ? `По категории (${revtypeName})` : revtypeName} <br />
        </Typography>
      </Grid>
      <Grid item xs={4} style={{ textAlign: "right" }}>
        <Button
          fullWidth
          className={classes.button}
          variant="outlined"
          onClick={backToList}
        >
          Вернуться назад
        </Button>
      </Grid>
      <Grid item xs={9}>
        <FormControl component="fieldset">
          <RadioGroup row name="type"
            value={parametr}
            onChange={(e) => { setParametr(Number(e.target.value)) }}
          >
            <FormControlLabel
              value={1}
              control={<CustomRadio />}
              label="Все товары"
              labelPlacement="end"
            />
            <FormControlLabel
              value={2}
              control={<CustomRadio />}
              label="Только товары прошедшие ревизию"
              labelPlacement="end"
            />
            <FormControlLabel
              value={3}
              control={<CustomRadio />}
              label="Только товары не прошедшие ревизию"
              labelPlacement="end"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <FormControlLabel
          value="start"
          control={<Checkbox color="primary" checked={onlyDiff} onChange={(e) => { setOnlyDiff(e.target.checked) }} />}
          label="Только товары с разницей в остатках"
          labelPlacement="end"
        />
      </Grid>
      {revisionDetails.length > 0 ?
        <Fragment>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table id="table-to-xls">
                <TableHead>
                  <TableRow>
                    <StyledTableCell />
                    <StyledTableCell>Штрих-код</StyledTableCell>
                    <StyledTableCell>Наименование товара</StyledTableCell>
                    <StyledTableCell>До ревизии</StyledTableCell>
                    <StyledTableCell>После ревизии</StyledTableCell>
                    <StyledTableCell>
                      Цена реализации на момент ревизии
                    </StyledTableCell>
                    <StyledTableCell>Остаток в ценах реализации</StyledTableCell>
                    <StyledTableCell>Разница в шт.</StyledTableCell>
                    <StyledTableCell>Разница в тг.</StyledTableCell>
                    <StyledTableCell>Время проведения ревизии</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revisionDetails.map((detail, idx) => (
                    <TableRow key={idx}>
                      <StyledTableCell>{idx + 1}</StyledTableCell>
                      <StyledTableCell>{detail.code}</StyledTableCell>
                      <StyledTableCell>{detail.name + " " + detail.attributescaption}</StyledTableCell>
                      <StyledTableCell>
                        {parseFloat(detail.unitswas).toLocaleString("ru", {
                          minimumFractionDigits: 1,
                        })}
                      </StyledTableCell>
                      <StyledTableCell>
                        {parseFloat(detail.units).toLocaleString("ru", {
                          minimumFractionDigits: 1,
                        })}
                      </StyledTableCell>
                      <StyledTableCell className="tenge">
                        {parseFloat(detail.price).toLocaleString("ru", {
                          minimumFractionDigits: 1,
                        })}
                      </StyledTableCell>
                      <StyledTableCell className="tenge">
                        {(
                          parseFloat(detail.price) * parseFloat(detail.units)
                        ).toLocaleString("ru", {
                          minimumFractionDigits: 1,
                        })}
                      </StyledTableCell>
                      <StyledTableCell>
                        {(parseFloat(detail.units) - parseFloat(detail.unitswas)).toLocaleString("ru", {
                          minimumFractionDigits: 1,
                        })}
                      </StyledTableCell>
                      <StyledTableCell className="tenge">
                        {parseFloat(
                          (detail.units - detail.unitswas) * detail.price
                        ).toLocaleString("ru", {
                          minimumFractionDigits: 1,
                        })}
                      </StyledTableCell>
                      <StyledTableCell>
                        {Moment(detail.revisiondate).format("DD.MM.YYYY HH:mm:ss")}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <StyledTableCell colSpan="2">Итого</StyledTableCell>
                    <StyledTableCell />
                    <StyledTableCell>
                      {revisionDetails
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.unitswas);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </StyledTableCell>
                    <StyledTableCell>
                      {revisionDetails
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.units);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </StyledTableCell>
                    <StyledTableCell className="tenge">
                      {revisionDetails
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.price);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </StyledTableCell>
                    <StyledTableCell className="tenge">
                      {revisionDetails
                        .reduce((prev, cur) => {
                          return (
                            prev + parseFloat(cur.price) * parseFloat(cur.units)
                          );
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </StyledTableCell>
                    <StyledTableCell>
                      {revisionDetails
                        .reduce((prev, cur) => {
                          return (
                            prev +
                            (parseFloat(cur.units) - parseFloat(cur.unitswas))
                          );
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </StyledTableCell>
                    <StyledTableCell className="tenge">
                      {revisionDetails
                        .reduce((prev, cur) => {
                          return (
                            prev +
                            (parseFloat(cur.units) - parseFloat(cur.unitswas)) *
                            parseFloat(cur.price)
                          );
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={6}>
            <button onClick={detailsToExcel} className="btn btn-success" disabled={isLoading}>
              Выгрузить в Excel
            </button>
          </Grid>
        </Fragment>
        :
        <Grid item xs={12} style={{ textAlign: "center", fontColor: "gray" }}>
          Товары не найдены
        </Grid>
      }
    </Fragment>
  );
}
