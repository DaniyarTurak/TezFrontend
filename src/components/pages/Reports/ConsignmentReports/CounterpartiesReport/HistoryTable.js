import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import ReactModal from "react-modal";
import IconButton from "@material-ui/core/IconButton";
import DescriptionIcon from "@material-ui/icons/Description";
import TableHead from "@material-ui/core/TableHead";
import { Link } from "react-router-dom";

ReactModal.setAppElement("#root");

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#17a2b8",
    color: theme.palette.common.white,
    fontSize: 12,
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  customHoverFocus: {
    "&:hover, &.Mui-focusVisible": { color: "#707070" },
  },
}));

export default function HistoryTable({
  consignments,
  changeParentReportMode,
  changeCurrentReportMode,
  id,
}) {
  const classes = useStyles();
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Тип операции</StyledTableCell>
              <StyledTableCell>Сумма</StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell>
                Передано на консигнацию за период:
              </StyledTableCell>
              <StyledTableCell className="tenge">
                {parseFloat(consignments.transfers).toLocaleString("ru", {
                  minimumFractionDigits: 2,
                })}
              </StyledTableCell>
              <StyledTableCell>
                <IconButton
                  aria-label="upload picture"
                  component="span"
                  onClick={() =>
                    changeParentReportMode("reportinvoicehistory", {
                      ...consignments,
                      type: 0,
                      isCounterparties: true,
                      customer: consignments.name,
                      id,
                    })
                  }
                >
                  <DescriptionIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                Возвращено консигнатором за период:
              </StyledTableCell>
              <StyledTableCell className="tenge">
                {parseFloat(consignments.returns).toLocaleString("ru", {
                  minimumFractionDigits: 2,
                })}
              </StyledTableCell>
              <StyledTableCell style={{ width: "5%" }}>
                <IconButton
                  aria-label="upload picture"
                  component="span"
                  onClick={() =>
                    changeParentReportMode("reportinvoicehistory", {
                      ...consignments,
                      type: 1,
                      isCounterparties: true,
                      customer: consignments.name,
                      id,
                    })
                  }
                >
                  <DescriptionIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell style={{ width: "35%" }}>
                Продано консигнатору за период:
              </StyledTableCell>
              <StyledTableCell className="tenge">
                {parseFloat(consignments.sales).toLocaleString("ru", {
                  minimumFractionDigits: 2,
                })}
              </StyledTableCell>
              <StyledTableCell style={{ width: "5%" }}>
                <IconButton
                  aria-label="upload picture"
                  to={`/usercabinet/report`}
                  component={Link}
                  className={classes.customHoverFocus}
                  onClick={() =>
                    changeParentReportMode("reporttransactions", {
                      ...consignments,
                      customer: consignments.name,
                      id,
                    })
                  }
                >
                  <DescriptionIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell style={{ width: "35%" }}>
                На консигнации у контрагента в данный момент:
              </StyledTableCell>
              <StyledTableCell className="tenge">
                {parseFloat(consignments.total).toLocaleString("ru", {
                  minimumFractionDigits: 2,
                })}
              </StyledTableCell>
              <StyledTableCell style={{ width: "5%" }}>
                <IconButton
                  aria-label="upload picture"
                  component="span"
                  onClick={() =>
                    changeCurrentReportMode("ConsignmentProducts", {
                      ...consignments,
                      customer: consignments.name,
                      id,
                    })
                  }
                >
                  <DescriptionIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
