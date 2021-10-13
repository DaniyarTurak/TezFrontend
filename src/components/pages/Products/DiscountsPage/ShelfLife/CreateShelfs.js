import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Alert from "react-s-alert";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import Axios from "axios";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#17a2b8",
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
  label: { marginTop: "0.5rem", marginRight: "0.5rem" },
});

let day = [];
let month = [];
for (let i = 0; i <= 31; i++) {
  day.push({ value: i, label: i });
}
for (let i = 0; i <= 12; i++) {
  month.push({ value: i, label: i });
}

const types = [
  {
    value: 1,
    label: "День",
  },
  {
    value: 2,
    label: "Месяц",
  },
];

export default function CreateShelfs({ shelf, setShelf }) {
  const classes = useStyles();

  const AlertWarning = (text) => {
    Alert.warning(text, {
      position: "top-right",
      effect: "bouncyflip",
      timeout: 2000,
    });
  };

  const handleAllChange = (row, key, e) => {
    const value = e.target.value;
    const newValue = key === "discount" ? (isNaN(value) ? 0 : value) : value;

    if (key === "to" && newValue < row.from) {
      return AlertWarning(
        "Значение окончания скидки не может быть меньше начала!"
      );
    }

    if (key === "discount" && newValue > 100) {
      return AlertWarning("Значение скидки не может быть больше 100%!");
    }
    //меняет вводимые значения в зафисимости от displayID и ключа объекта;
    shelf.forEach((q) => {
      if (key === "from" && newValue > row.to) {
        q.to = q.displayID === row.displayID ? newValue : q.to;
      }
      if (key === "objectid" && newValue > row.to) {
        q.objectid = q.displayID === row.displayID ? newValue : 0;
        q.object = q.displayID === row.displayID ? (newValue.toString() === "0" ? null : 2) : null;
      }
      q[key] = q.displayID === row.displayID ? newValue : q[key];

      if (key === "type" && value === 1) {
        q.fromPicker = q.displayID === row.displayID ? day : q.fromPicker;
        q.from = q.displayID === row.displayID ? 0 : q.from;
        q.to = q.displayID === row.displayID ? 0 : q.to;
        q.toPicker = q.displayID === row.displayID ? day : q.toPicker;
      } else if (key === "type" && value === 2) {
        q.fromPicker = q.displayID === row.displayID ? month : q.fromPicker;
        q.toPicker = q.displayID === row.displayID ? month : q.toPicker;
        q.from = q.displayID === row.displayID ? 0 : q.from;
        q.to = q.displayID === row.displayID ? 0 : q.to;

      }
    });
    setShelf([...shelf]);
  };
  const handleAdd = () => {
    const counter = {
      displayID: shelf[shelf.length - 1].displayID + 1,
      from: 0,
      to: 0,
      type: 1,
      discount: 0,
      fromPicker: day,
      toPicker: day,
    };
    setShelf([...shelf, counter]);
  };

  const handleDelete = (id) => {
    const idx = shelf.findIndex((el, idx) => idx === id);
    const newArray = [...shelf.slice(0, idx), ...shelf.slice(idx + 1)];

    setShelf([...newArray]);
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, [])

  const getCategories = () => {
    Axios.get("/api/categories/getcategories")
      .then((res) => res.data)
      .then((data) => {
        let c = [];
        data.forEach(category => {
          if (!category.deleted) {
            c.push(category);
          }

        })
        c.unshift({ id: 0, name: "Все категории" });
        setCategories(c);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <TableContainer style={{ marginTop: "1rem" }} component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Тип</StyledTableCell>
            <StyledTableCell align="center">Категория</StyledTableCell>
            <StyledTableCell colSpan={2} align="center">
              Срок годности товара в диапазоне:
            </StyledTableCell>
            <StyledTableCell align="center">
              Скидки по срокам годности [%]
            </StyledTableCell>
            <StyledTableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {shelf.map((row, idx) => (
            <StyledTableRow key={row.displayID}>
              <StyledTableCell align="center">
                <TextField
                  id="type"
                  select
                  label="Тип"
                  value={row.type}
                  onChange={(e) => handleAllChange(row, "type", e)}
                >
                  {types.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </StyledTableCell>
              <StyledTableCell align="center">
                <TextField
                  id="objectid"
                  select
                  label="Категория"
                  value={row.objectid}
                  onChange={(e) => handleAllChange(row, "objectid", e)}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </StyledTableCell>
              <StyledTableCell align="center">
                {/* <label className={classes.label}>От:</label> */}
                <TextField
                  id="from"
                  select
                  label="От:"
                  value={row.from}
                  onChange={(e) => handleAllChange(row, "from", e)}
                >
                  {row.fromPicker.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </StyledTableCell>
              <StyledTableCell align="center">
                {/* <label className={classes.label}>До:</label> */}
                <TextField
                  id="to"
                  select
                  label="До:"
                  value={row.to}
                  onChange={(e) => handleAllChange(row, "to", e)}
                >
                  {row.toPicker.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </StyledTableCell>

              <StyledTableCell align="center">
                <TextField
                  id="discount"
                  label="Скидка"
                  value={row.discount}
                  onChange={(e) => handleAllChange(row, "discount", e)}
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                {shelf.length - 1 === idx ? (
                  <IconButton
                    aria-label="add new item"
                    component="span"
                    onClick={handleAdd}
                  >
                    <AddBoxIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="add new item"
                    component="span"
                    onClick={() => handleDelete(idx)}
                  >
                    <IndeterminateCheckBoxIcon />
                  </IconButton>
                )}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
