import React, { useEffect, useState, Fragment } from "react";
import Axios from "axios";
import Moment from "moment";
import Alert from "react-s-alert";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import "moment/locale/ru";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
Moment.locale("ru");

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

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

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function Zreports({
  company,
  reportsModalIsOpen,
  setReportsModalIsOpen,
  closeReports,
  cashbox,
}) {
  const [reports, setReports] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));

  useEffect(
    () => {
      handleSearch();
    },
    company ? [company.value] : []
  );

  const changeDate = (dateStr) => {
    let dateFromChanged, dateToChanged;
    if (dateStr === "today") {
      dateFromChanged = Moment().format("YYYY-MM-DD");
      dateToChanged = Moment().format("YYYY-MM-DD");
    } else if (dateStr === "month") {
      dateFromChanged = Moment().startOf("month").format("YYYY-MM-DD");
      dateToChanged = Moment().format("YYYY-MM-DD");
    }
    setDateFrom(dateFromChanged);
    setDateTo(dateToChanged);
    setLoading(true);
    getReports(dateFromChanged, dateToChanged, cashbox.id);
  };
  const dateFromChange = (e) => {
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateTo(e);
  };

  const handleSearch = () => {
    if (!dateFrom || !dateTo) {
      const text = !dateFrom ? "Дата с" : !dateTo ? "Дата по" : "Фильтр";
      Alert.warning(`Заполните поле  ${text}`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
      return;
    } else if (dateFrom > dateTo) {
      Alert.warning(`Заполните дату правильно`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
      return;
    }
    setLoading(false);
    getReports(dateFrom, dateTo, cashbox.id);
  };

  const getExcel = () => {
    let reportsChanged = [];
    reports.forEach((e) => {
      !(
        e && // 👈 null and undefined check
        Object.keys(e).length === 0 &&
        e.constructor === Object
      ) &&
        reportsChanged.push({
          ...e,
          Debt: e.Debt ? e.Debt : 0,
          DebitMinusDebt:
            parseFloat(e.Debit) - (e.Debt ? parseFloat(e.Debt) : 0),
          Total:
            parseFloat(e.Debit) +
            parseFloat(e.Card) +
            parseFloat(e.Cash) +
            (e.Debt ? parseFloat(e.Debt) : 0),
        });
    });
    Axios({
      method: "POST",
      url: "/api/cashbox/z_excel",
      data: { reportsChanged },
      responseType: "blob",
    })
      .then((res) => res.data)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Отчёт по сменам.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getReports = (dateFrom, dateTo) => {
    Axios.get("/api/cashbox/z_report", {
      params: { dateFrom, dateTo, cashbox: cashbox.id },
    })
      .then((res) => res.data)
      .then((result) => {
        setReports(result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const closeModal = () => {
    closeReports(true);
  };
  return (
    <Dialog
      onClose={closeModal}
      keepMounted
      open={reportsModalIsOpen}
      maxWidth="lg"
    >
      <DialogTitle
        onClose={() => {
          setReportsModalIsOpen(false);
        }}
      >
        Отчёт по сменам
      </DialogTitle>

      <DialogContent>
        <MaterialDateDefault
          changeDate={changeDate}
          dateFrom={dateFrom}
          dateTo={dateTo}
          dateFromChange={dateFromChange}
          dateToChange={dateToChange}
          searchInvoices={handleSearch}
        />
        {isLoading && <SkeletonTable />}

        {!isLoading && reports.length === 0 && (
          <DialogContentText style={{ marginTop: "1rem" }} align="center">
            За данный период Z-отчеты отсутствуют
          </DialogContentText>
        )}

        {!isLoading && reports.length > 0 && (
          <Fragment>
            <TableContainer
              component={Paper}
              style={{ marginTop: "2rem", marginBottom: "1rem" }}
            >
              <Table id="table-to-xls">
                <TableHead>
                  <TableRow>
                    <StyledCell>Смена</StyledCell>
                    <StyledCell>Открытие смены</StyledCell>
                    <StyledCell>Наличные в кассе на начало смены</StyledCell>
                    <StyledCell>Продажи наличными</StyledCell>
                    <StyledCell>Возвраты наличными</StyledCell>
                    <StyledCell>Возвраты на карту</StyledCell>
                    <StyledCell>Приходные кассовые ордера</StyledCell>
                    <StyledCell>Расходные кассовые ордера</StyledCell>
                    <StyledCell>Закрытие смены</StyledCell>
                    <StyledCell>Наличные в кассе на конец смены</StyledCell>
                    <StyledCell>Продажи картой</StyledCell>
                    <StyledCell>Продажи безналичными переводами</StyledCell>
                    <StyledCell>Продажи в долг</StyledCell>
                    <StyledCell>
                      Итого продаж (нал+картой+перевод+долг)
                    </StyledCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((rep) =>
                    !(
                      rep && // 👈 null and undefined check
                      Object.keys(rep).length === 0 &&
                      rep.constructor === Object
                    ) ? (
                      <TableRow key={rep.Hash}>
                        <StyledCell>№{rep.ShiftNumber}</StyledCell>
                        <StyledCell>
                          {Moment(rep.StartDate).format("DD.MM.YYYY HH:mm:ss")}
                        </StyledCell>
                        <StyledCell className="tenge">
                          {parseFloat(rep.OpenCash).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          })}
                        </StyledCell>
                        <StyledCell className="tenge">
                          {parseFloat(rep.Cash).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          })}
                        </StyledCell>
                        <StyledCell className="tenge">
                          {parseFloat(rep.CRefund).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          })}
                        </StyledCell>
                        <StyledCell className="tenge">
                          {(rep.CardRefund || rep.CardRefund === 0) ? parseFloat(rep.CardRefund).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          }) : "n/a"}
                        </StyledCell>
                        <StyledCell className="tenge">
                          {parseFloat(rep.PKO).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          })}
                        </StyledCell>
                        <StyledCell className="tenge">
                          {parseFloat(rep.RKO).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          })}
                        </StyledCell>
                        <StyledCell>
                          {Moment(rep.EndDate).format("DD.MM.YYYY HH:mm:ss")}
                        </StyledCell>
                        <StyledCell className="tenge">
                          {parseFloat(rep.CashSumm).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          })}
                        </StyledCell>
                        <StyledCell className="tenge">
                          {parseFloat(rep.Card).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          })}
                        </StyledCell>
                        <StyledCell className="tenge">
                          {(
                            parseFloat(rep.Debit) -
                            (rep.Debt ? parseFloat(rep.Debt) : 0)
                          ).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          })}
                        </StyledCell>
                        <StyledCell className="tenge">
                          {!rep.Debt
                            ? "0.00"
                            : rep.Debt.toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledCell>
                        <StyledCell className="tenge">
                          {(
                            parseFloat(rep.Cash) +
                            parseFloat(rep.Debit) +
                            parseFloat(rep.Card) +
                            (rep.Debt ? parseFloat(rep.Debt) : 0)
                          ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                        </StyledCell>
                      </TableRow>
                    ) : (
                      ""
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <button
              className="btn btn-sm btn-outline-info"
              table="table-to-xls"
              onClick={getExcel}
            >
              Выгрузить в Excel
            </button>
          </Fragment>
        )}
      </DialogContent>
    </Dialog>
  );
}
