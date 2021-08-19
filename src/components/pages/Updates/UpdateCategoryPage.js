import React, { Fragment, useEffect, useState } from "react";
import Axios from "axios";
import Alert from "react-s-alert";
import Searching from "../../Searching";
import SweetAlert from "react-bootstrap-sweetalert";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
export default function UpdateBonusPage() {

  const [categories, setCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);

  const useStylesAC = makeStyles(theme =>
    createStyles({
      root: {
        '& label.Mui-focused': {
          color: '#17a2b8',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: '#17a2b8',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#ced4da',
          },
          '&:hover fieldset': {
            borderColor: '#ced4da',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#17a2b8',
          },
        },
      },
    })
  );
  const classesAC = useStylesAC();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    Axios.get("/api/categories/getcategories")
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        let c = [];
        let d = [];
        data.forEach(category => {
          if (category.deleted) {
            d.push(category);
          }
          else {
            c.push({ ...category, isAddingSub: false, subName: "" });
          }
        });
        setCategories(c);
        setDeletedCategories(d);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addSubcategory = (id) => {
    setCategories(prevState => {
      let obj = prevState[id];
      obj.isAddingSub = true;
      return [...prevState];
    })
  };

  const cancelAdd = (id) => {
    setCategories(prevState => {
      let obj = prevState[id];
      obj.isAddingSub = false;
      return [...prevState];
    })
  };

  const nameChange = (value, id) => {
    setCategories(prevState => {
      let obj = prevState[id];
      obj.name = value;
      return [...prevState];
    });
  };

  const subNameChange = (value, id) => {
    setCategories(prevState => {
      let obj = prevState[id];
      obj.subName = value;
      return [...prevState];
    });
  }

  return (
    <Fragment>
      <Grid container spacing={3}>
        {categories.map((category, id) => (
          <Grid item xs={12} key={category.id}>
            <Paper>
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  {id + 1}
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    value={category.name}
                    classes={{
                      root: classesAC.root,
                    }}
                    onChange={(e) => nameChange(e.target.value, id)}
                    placeholder="Название категории"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={5} />
                <Grid item xs={1} />
                {!category.isAddingSub &&
                  <Grid item xs={6} style={{ cursor: "pointer" }}>
                    <Button
                      onClick={() => addSubcategory(id)}
                    >
                      <AddCircleIcon />
                      &emsp; Добавить подкатегорию
                    </Button>
                  </Grid>}
                {category.isAddingSub &&
                  <Fragment>
                    <Grid item xs={1} />
                    <Grid item xs={3}>
                      <TextField
                        value={category.subName}
                        classes={{
                          root: classesAC.root,
                        }}
                        onChange={(e) => subNameChange(e.target.value, id)}
                        placeholder="Название подкатегории"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <IconButton>
                        <SaveIcon />
                      </IconButton>
                      &nbsp;
                      <IconButton onClick={() => cancelAdd(id)}>
                        <CancelIcon />
                      </IconButton>
                    </Grid>
                  </Fragment>}
                <Grid item xs={5} />
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Fragment>
  )
}