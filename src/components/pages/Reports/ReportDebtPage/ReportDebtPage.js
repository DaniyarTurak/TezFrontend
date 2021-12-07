import React, { Fragment, useState, useEffect } from 'react';
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Axios from "axios";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import TextField from '@material-ui/core/TextField';
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import ruLocale from 'date-fns/locale/ru';
import ClearIcon from "@material-ui/icons/Clear";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";


const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    buttonGrid: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      marginBottom: "0.5rem",
    },
    button: {
      width: "12rem",
      minHeight: "3.5rem",
      fontSize: ".875rem",
      textTransform: "none",
    },
  }));
  const StyledCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#17a2b8",
      color: theme.palette.common.white,
      fontSize: ".875rem",
    },
    body: {
      fontSize: ".875rem",
    },
    footer: {
      color: theme.palette.common.black,
      fontSize: ".875rem",
      fontWeight: "bold",
    },
  }))(TableCell);

function ReportDebtPage() {
    const [date, setDate] = useState(null);
    const classes = useStyles();
    const [debtData, setDebtData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [filterDate, setFilterDate] = useState(null);


    useEffect(() => {
      getDebtData(filterDate)
      console.log(filterDate)
    }, [filterDate])

  
  const getDebtData = (date) => {
      Axios.get("/api/report/fizcustomers/debt_book", { params: { date: date } })
                .then((res) => res.data)
                .then((result) => {
                    setDebtData(result);
                    setLoading(false);
                    setError(false);
                })
                .catch((err) => {
                    setLoading(false);
                    setError(true);
                    ErrorAlert(err);
                });
  }
    
    return (
      <Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={ruLocale}
                  >
                    <KeyboardDatePicker
                      label={"Долг на дату"}
                      value={date}
                      renderInput={(params) => <TextField {...params} />}
                      onChange={(newValue) => {
                        setDate(newValue);
                      }}
                      disableToolbar
                      autoOk
                      variant="inline"
                      format="dd.MM.yyyy"
                      InputProps={
                        date && {
                          startAdornment: (
                            <IconButton
                              onClick={() => {
                                setDate(null);
                                setFilterDate(null);
                              }}
                              disabled={!date}
                              style={{ order: 1 }}
                            >
                              <ClearIcon color="disabled" fontSize="small" />
                            </IconButton>
                          ),
                        }
                      }
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={2} className={classes.buttonGrid}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    disabled={!date}
                    onClick={() => {
                      const Date =
                        date.getFullYear() +
                        "-" +
                        (date.getMonth() + 1) +
                        "-" +
                        date.getDate();
                      setFilterDate(Date);
                    }}
                  >
                    Поиск
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            {isLoading && <SkeletonTable />}

            {!isLoading && isError && (
              <div className="row text-center">
                <div className="col-md-12 not-found-text">
                  Произошла ошибка. Попробуйте позже.
                </div>
              </div>
            )}
            {!isLoading && !isError && debtData.length === 0 && (
              <div className="row text-center">
                <div className="col-md-12 not-found-text">
                  Клиенты не найдены
                </div>
              </div>
            )}

            {!isLoading && !isError && debtData.length > 0 && (
              <TableContainer
                component={Paper}
                style={{ marginTop: "1rem", marginBottom: "1rem" }}
              >
                <Table id="table-to-xls">
                  <TableHead>
                    <TableRow>
                      <StyledCell>Фамилия Имя</StyledCell>
                      <StyledCell>Телефон</StyledCell>
                      <StyledCell>Покупка в долг</StyledCell>
                      <StyledCell>Погашение</StyledCell>
                      <StyledCell>Текущий долг</StyledCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {debtData.map((data) => {
                      return (
                        <TableRow key={data.telephone}>
                          <StyledCell>{data.name}</StyledCell>
                          <StyledCell>{data.telephone}</StyledCell>
                          <StyledCell className="tenge">
                            {data.credit.toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                          </StyledCell>
                          <StyledCell className="tenge">
                            {data.debit.toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                          </StyledCell>
                          <StyledCell className="tenge">
                            {data.debt.toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                          </StyledCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      </Fragment>
    );
}

export default ReportDebtPage
