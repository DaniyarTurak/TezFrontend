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
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
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
    fontSize: 12,
  },
  body: {
    fontSize: 12,
  },
  footer: {
    color: theme.palette.common.black,
    fontSize: 12,
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

export default function CashboxDetails({
  company,
  cashbox,
  holding,
  modalIsOpen,
  setModalOpen,
  closeDetail,
}) {
  const [operations, setOperations] = useState([]);
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
    getOperations(dateFromChanged, dateToChanged, cashbox.id);
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
    setLoading(true);
    getOperations(dateFrom, dateTo, cashbox.id);
  };

  const getOperations = (dateFrom, dateTo, cashbox) => {
    const comp = company ? company.value : "";
    if (!holding) {
      holding = false;
    }
    Axios.get("/api/report/cashbox/cashbox-operations", {
      params: { dateFrom, dateTo, cashbox, company: comp, holding },
    })
      .then((res) => res.data)
      .then((operations) => {
        setOperations(operations);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const closeModal = () => {
    closeDetail(true);
  };
  return (
    <Dialog onClose={closeModal} keepMounted open={modalIsOpen} maxWidth="lg">
      <DialogTitle
        onClose={() => {
          setModalOpen(false);
        }}
      >
        Отчёт по кассовым ордерам
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

        {!isLoading && operations.length === 0 && (
          <DialogContentText style={{ marginTop: "1rem" }} align="center">
            За данный период кассовые ордера отсутствуют
          </DialogContentText>
        )}

        {!isLoading && operations.length > 0 && (
          <Fragment>
            <TableContainer
              component={Paper}
              style={{ marginTop: "2rem", marginBottom: "1rem" }}
            >
              <Table id="table-to-xls">
                <TableHead>
                  <TableRow>
                    <StyledCell />
                    <StyledCell>Кассир</StyledCell>
                    <StyledCell>Операция</StyledCell>
                    <StyledCell>Сумма</StyledCell>
                    <StyledCell>Дата Проведения</StyledCell>
                    <StyledCell>ФИО</StyledCell>
                    <StyledCell>Комментарий</StyledCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {operations.map((operation, idx) => (
                    <TableRow key={idx}>
                      <StyledCell>{idx + 1}</StyledCell>
                      <StyledCell>{operation.conductor}</StyledCell>
                      <StyledCell>{operation.name}</StyledCell>
                      <StyledCell className="tenge">
                        {operation.quantity}
                      </StyledCell>
                      <StyledCell>
                        {Moment(operation.date).format("LLL")}
                      </StyledCell>
                      <StyledCell>{operation.person}</StyledCell>
                      <StyledCell>{operation.comments}</StyledCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <StyledCell colSpan={3}>Итого</StyledCell>
                    <StyledCell className="tenge">
                      {operations
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.quantity);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </StyledCell>
                    <StyledCell colSpan={3} />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>

            <ReactHTMLTableToExcel
              className="btn btn-sm btn-outline-info"
              table="table-to-xls"
              filename={`Кассовый ордер по ${Moment(dateFrom).format(
                "DD.MM.YYYY"
              )} по ${Moment(dateTo).format("DD.MM.YYYY")}`}
              sheet="tablexls"
              buttonText="Выгрузить в excel"
            />
          </Fragment>
        )}
      </DialogContent>
    </Dialog>
  );
}
