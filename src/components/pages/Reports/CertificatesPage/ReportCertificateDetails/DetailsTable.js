import React, { Fragment } from "react";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Paper from "@material-ui/core/Paper";
import TableCell from "@material-ui/core/TableCell";

import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Moment from "moment";
import "moment/locale/ru";
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

export default function DetailsTable({
  classes,
  certificates,
  handleCheckboxChange,
  handleWriteOff,
  isLoading,
}) {
  const [selectedID, setSelectedID] = React.useState(null);

  return (
    <Fragment>
      <Grid item xs={12}>
        <TableContainer component={Paper} className={classes.container}>
          <Table className={classes.table} id="table-to-xls">
            <TableHead>
              <TableRow>
                <StyledTableCell>№</StyledTableCell>
                <StyledTableCell align="center">Код</StyledTableCell>
                <StyledTableCell align="center">Номинал</StyledTableCell>
                <StyledTableCell align="center">Баланс</StyledTableCell>
                <StyledTableCell align="center">
                  Дата образования остатка
                </StyledTableCell>
                <StyledTableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {certificates.map((certificate, idx) => (
                <TableRow
                  key={certificate.id}
                  selected={selectedID === certificate.id}
                  onClick={() => setSelectedID(certificate.id)}
                >
                  <StyledTableCell>{idx + 1}</StyledTableCell>
                  <StyledTableCell align="center">
                    {certificate.code}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {certificate.denomination}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {certificate.balance}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {certificate.date}
                  </StyledTableCell>
                  <StyledTableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={certificate.checked}
                          onChange={(e) => handleCheckboxChange(idx, e)}
                          name={certificate.id}
                          style={{ color: "#17a2b8" }}
                        />
                      }
                    />
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={3}>
        <ReactHTMLTableToExcel
          className="btn btn-sm btn-outline-success"
          table="table-to-xls"
          filename={`Сертификаты на списание`}
          sheet="tablexls"
          buttonText="Выгрузить в excel"
        />
      </Grid>

      <Grid item xs={3}>
        <Button
          fullWidth
          className={classes.button}
          variant="outlined"
          disabled={isLoading}
          onClick={handleWriteOff}
        >
          Списать
        </Button>
      </Grid>
    </Fragment>
  );
}
