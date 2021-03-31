import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
  tableRow: {
    backgroundColor: "#17a2b8",
    "&:last-child th, &:last-child StyledCell": {
      borderBottom: 0,
      borderRight: 0,
    },
    fontSize: ".875rem",
  },
  notFound: {},
});

const StyledCell = withStyles(() => ({
  head: {
    fontSize: ".875rem",
  },
  body: {
    fontSize: ".875rem",
  },
  root: {
    verticalAlign: "middle!important",
    borderBottom: "1px solid rgba(224, 224, 224, 1)!important",
  },
}))(TableCell);

const StyledFooterCell = withStyles((theme) => ({
  root: {
    border: 0,
    fontSize: ".875rem",
    color: theme.palette.common.white,
  },
}))(TableCell);

function ReturnsNDS({ salesResultNDS, classes, filterType, totalResultsNDS }) {
  return (
    <TableContainer
      component={Paper}
      elevation={3}
      className={classes.root}
      style={{ marginTop: "2rem" }}
    >
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledCell
              className="border-right-material font-weight-bold"
              rowSpan={4}
              style={{ width: "20%" }}
            >
              Наименование
            </StyledCell>
            <StyledCell colSpan={8} align="center" className="font-weight-bold">
              Возвраты
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell colSpan={8} align="center" className="font-weight-bold">
              В том числе
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell
              colSpan={2}
              rowSpan={2}
              align="center"
              className="border-right-material"
            >
              Общая сумма товаров, освобожденных от НДС
            </StyledCell>
            <StyledCell
              colSpan={2}
              align="center"
              className="border-right-material"
            >
              Общая сумма товаров, облагаемых НДС
            </StyledCell>
            <StyledCell rowSpan={2} colSpan={4} align="center">
              Итого возвратов <br />С учётом применённой скидки
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell className="border-right-material" align="center">
              Общая сумма товаров
            </StyledCell>
            <StyledCell className="border-right-material" align="center">
              В том числе НДС
            </StyledCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterType.value !== "cashbox" &&
            salesResultNDS.map((row, idx) => (
              <TableRow key={idx}>
                <StyledCell>{row.name}</StyledCell>
                <StyledCell colSpan={2} align="center" className="tenge">
                  {parseFloat(row.retwithoutvat).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
                <StyledCell align="center" className="tenge">
                  {parseFloat(row.retwithvat).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
                <StyledCell align="center" className="tenge">
                  {parseFloat(row.retvat).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
                <StyledCell colSpan={4} align="center" className="tenge">
                  {parseFloat(row.rettotal).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
              </TableRow>
            ))}

          {filterType.value === "cashbox" &&
            salesResultNDS.map((row, idx) => (
              <Fragment key={idx}>
                <TableRow key={idx} className="bg-light-grey">
                  <StyledCell>{row.point}</StyledCell>
                  <StyledCell colSpan={2} align="center" className="tenge">
                    {row.cashboxesNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.retwithoutvat);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                  <StyledCell align="center" className="tenge">
                    {row.cashboxesNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.retwithvat);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                  <StyledCell align="center" className="tenge">
                    {row.cashboxesNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.retvat);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                  <StyledCell colSpan={4} align="center" className="tenge">
                    {row.cashboxesNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.rettotal);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                </TableRow>
                {row.cashboxesNDS.map((sl, idx) => {
                  return (
                    <TableRow key={idx}>
                      <StyledCell>{sl.name}</StyledCell>
                      <StyledCell colSpan={2} align="center" className="tenge">
                        {parseFloat(sl.retwithoutvat).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledCell>
                      <StyledCell align="center" className="tenge">
                        {parseFloat(sl.retwithvat).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledCell>
                      <StyledCell align="center" className="tenge">
                        {parseFloat(sl.retvat).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledCell>
                      <StyledCell colSpan={4} align="center" className="tenge">
                        {parseFloat(sl.rettotal).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledCell>
                    </TableRow>
                  );
                })}
              </Fragment>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow className={classes.tableRow}>
            <StyledFooterCell>Итого</StyledFooterCell>
            <StyledFooterCell colSpan={2} align="center" className="tenge">
              {totalResultsNDS
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.retwithoutvat);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {totalResultsNDS
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.retwithvat);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {totalResultsNDS
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.retvat);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell colSpan={4} align="center" className="tenge">
              {totalResultsNDS
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.rettotal);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

ReturnsNDS.propTypes = {
  classes: PropTypes.object.isRequired,
  salesResultNDS: PropTypes.array.isRequired,
  filterType: PropTypes.object.isRequired,
  totalResultsNDS: PropTypes.array.isRequired,
};

export default withStyles(styles)(ReturnsNDS);
