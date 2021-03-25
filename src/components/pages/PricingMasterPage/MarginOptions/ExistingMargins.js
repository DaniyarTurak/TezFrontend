import React from "react";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Alert from "react-s-alert";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#17a2b8",
    color: theme.palette.common.white,
    fontSize: "0.875rem",
  },
  body: {
    fontSize: "0.875rem",
  },
  footer: {
    fontSize: "0.875rem",
    fontWeight: "bold",
  },
}))(TableCell);

export default function ExistingMargins({
  list,
  type,
  isMarginLoading,
  classes,
  getActiveMargins,
}) {
  const handleDelete = (info) => {
    Axios.post("/api/margin/del", { id: info.id, type })
      .then((res) => res.data)
      .then((res) => {
        Alert.success("Маржа успешно удалена!", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 5000,
        });
        getActiveMargins();
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  return (
    <Grid item xs={12}>
      {isMarginLoading ? (
        <SkeletonTable />
      ) : list.length > 0 ? (
        <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Наименование</StyledTableCell>
                <StyledTableCell align="center">Процент Маржи</StyledTableCell>
                <StyledTableCell align="center">Сумма Маржи</StyledTableCell>
                <StyledTableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((info, idx) => {
                return (
                  <TableRow key={idx}>
                    <StyledTableCell>{info.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {info.rate}%
                    </StyledTableCell>
                    <StyledTableCell align="center" className="tenge">
                      {info.sum}
                    </StyledTableCell>

                    <StyledTableCell>
                      <IconButton
                        aria-label="delete item"
                        component="span"
                        onClick={() => {
                          handleDelete(info);
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p className={classes.paragraph}>Маржа не найдена</p>
      )}
    </Grid>
  );
}
