import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Alert from "react-s-alert";
import TableSkeleton from "../../../../Skeletons/TableSkeleton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Axios from "axios";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#bdbdbd",
    color: theme.palette.common.white,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  button: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  notFountd: {
    opacity: "60%",
    display: "flex",
    justifyContent: "center",
  },
});

export default function ExistingShelfs({ isSubmitting }) {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(isSubmitting);
  const [oldShelfs, setOldShelfs] = useState([]);

  useEffect(() => {
    if (!isSubmitting) {
      getShelfs();
    }
  }, [isSubmitting]);

  const getShelfs = () => {
    setLoading(true);
    Axios.get("/api/expdatediscount")
      .then((res) => res.data)
      .then((res) => {
        setOldShelfs(res);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const handleDelete = (row, e) => {
    const expdatediscount = [row];
    Axios.post("/api/expdatediscount/manage", { expdatediscount })
      .then(() => {
        getShelfs();
        Alert.success("Скидка удалена успешна!", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  return isLoading ? (
    <TableSkeleton />
  ) : oldShelfs.length > 0 ? (
    <TableContainer style={{ marginTop: "1rem" }} component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell colSpan={2} align="center">
              Срок годности товара в диапазоне:
            </StyledTableCell>
            <StyledTableCell align="center">Тип</StyledTableCell>
            <StyledTableCell align="center">
              Скидки по срокам годности [%]
            </StyledTableCell>
            <StyledTableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {oldShelfs.map((row, idx) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell align="center">
                <label style={{ marginRight: "0.5rem" }}>От:</label>
                {row.from}
              </StyledTableCell>
              <StyledTableCell align="center">
                <label style={{ marginRight: "0.5rem" }}>До:</label>
                {row.to}
              </StyledTableCell>
              <StyledTableCell align="center">
                {row.type === 1 ? "День" : "Месяц"}
              </StyledTableCell>
              <StyledTableCell align="center">{row.discount} %</StyledTableCell>
              <StyledTableCell align="center">
                <IconButton
                  aria-label="delete item"
                  component="span"
                  onClick={(e) => handleDelete(row, e)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <div className={classes.notFountd}>Сроки годности не найдены</div>
  );
}
