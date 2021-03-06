import React, { Fragment, useEffect, useState } from "react";
import Axios from "axios";
import Alert from "react-s-alert";
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SecondLevel from './SecondLevel';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeletedCategories from "./DeletedCategories";
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

export default function UpdateCategoryPage() {

  const useStylesAC = makeStyles(theme =>
    createStyles({
      input: {
        padding: "5px"
      },
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

  const [categories, setCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [name, setName] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    Axios.get("/api/categories/getcategories")
      .then((res) => res.data)
      .then((data) => {
        let c = [];
        let d = [];
        data.forEach(category => {
          if (category.deleted) {
            d.push(category);
          }
          else {
            c.push({ ...category, name_temp: category.name, isAddingSub: false, subName: "", open: false, deleted: false, child: [] });
          }
        });
        setCategories(c);
        setDeletedCategories(d);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const nameChange = (value, id) => {
    setCategories(prevState => {
      let obj = prevState[id];
      obj.name = value;
      return [...prevState];
    });
  };

  const subNameChange = (value, idx) => {
    let id;
    categories.forEach((cat, indx) => {
      if (cat.id === idx) {
        id = indx;
      }
    });
    setCategories(prevState => {
      let obj = prevState[id];
      obj.subName = value;
      return [...prevState];
    });
  };

  const updateCategory = (cat, id) => {
    const category = {
      name: cat.name,
      deleted: false,
      id: cat.id,
      parent_id: cat.parentid
    };
    Axios.post("/api/categories/updatecategories", { category })
      .then(() => {
        Alert.success("?????????????????? ?????????????? ??????????????????", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setCategories(prevState => {
          let obj = prevState[id];
          obj.name_temp = cat.name;
          return [...prevState];
        })
      })
      .catch((err) => {
        Alert.error(err, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  const saveSubcategory = (idx) => {
    let category;
    let id;
    categories.forEach((el, indx) => {
      if (el.id === idx) {
        id = indx
        category = {
          name: el.subName,
          deleted: false,
          parent_id: el.id,
        }
      }
    });
    Axios.post("/api/categories/updatecategories", { category })
      .then((res) => {
        Alert.success("???????????????????????? ?????????????? ??????????????????", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setCategories(prevState => {
          let obj = prevState[id];
          obj.subName = "";
          obj.child = [...obj.child, {
            child: [],
            deleted: false,
            id: res.data.text,
            name: category.name,
            parentid: category.parent_id,
          }];
          return [...prevState];
        });
      })
      .catch((err) => {
        Alert.error(err, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  const newCategory = () => {
    const category = {
      name: name,
      deleted: false,
      parent_id: 0,
    };
    Axios.post("/api/categories/updatecategories", { category })
      .then((res) => {
        Alert.success("?????????????????? ?????????????? ??????????????????", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setName("");
        getCategories();
      })
      .catch((err) => {
        console.log(err);
        Alert.error(err, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  const deleteCategory = (cat, id) => {
    if (cat.child.length > 0) {
      Alert.warning("?????????????? ???????????????????? ?????????????? ?????? ????????????????????????", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 4000,
      });
    }
    else {
      const category = {
        name: cat.name,
        deleted: true,
        id: cat.id,
        parent_id: cat.parentid
      };
      Axios.post("/api/categories/updatecategories", { category })
        .then(() => {
          Alert.success("?????????????????? ?????????????? ??????????????", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          setCategories(prevState => {
            let obj = prevState[id];
            obj.deleted = true;
            return [...prevState];
          })
          setDeletedCategories([...deletedCategories, cat]);
        })
        .catch((err) => {
          Alert.error(err, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        });
    }
  };

  const expandSubcategories = (idx, category) => {
    if (category.open) {
      setCategories(prevState => {
        let obj = prevState[idx];
        obj.open = !obj.open;
        return [...prevState];
      });
    }
    else {
      Axios.get("/api/categories/getcategories", { params: { parentid: category.id } })
        .then((res) => res.data)
        .then((data) => {
          setCategories(prevState => {
            let obj = prevState[idx];
            obj.open = !obj.open;
            obj.child = data;
            return [...prevState];
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item xs={1} />
        <Grid item xs={11}>
          ???????????????? ?????????? ??????????????????
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={9}>
          <TextField
            style={{ paddingTop: "5px" }}
            fullWidth
            value={name}
            classes={{
              root: classesAC.root,
            }}
            onChange={(e) => setName(e.target.value)}
            placeholder="???????????????? ??????????????????"
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={2} style={{ paddingTop: "10px" }}>
          <button
            className="btn btn-success btn-block"
            onClick={newCategory}
          >
            ??????????????
          </button>
        </Grid>
        <Grid item xs={12}>
          <hr style={{ margin: "0px" }} />
        </Grid>
        <Grid item xs={12} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <b>???????????? ??????????????????</b>
        </Grid>
        {categories.map((category, id) => (
          category.deleted === false &&
          <Fragment key={id} >
            <Grid item xs={1} style={{ textAlign: "right" }}>
              {id + 1} &emsp;
              <IconButton onClick={() => expandSubcategories(id, category)} style={{ padding: "5px" }}>
                {category.open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Grid>
            <Grid item xs={9} style={{ display: "flex", alignItems: "center" }}>
              <TextField
                fullWidth
                value={category.name}
                classes={{
                  root: classesAC.root,
                }}
                onChange={(e) => nameChange(e.target.value, id)}
                placeholder="???????????????? ??????????????????"
                variant="outlined"
                size="small"
                inputProps={{
                  style: { padding: "5px" },
                }}
              />
            </Grid>
            <Grid item xs={2} style={{ textAlign: "right" }}>
              {category.name !== category.name_temp &&
                <Button onClick={() => updateCategory(category, id)}
                  style={{ padding: "5px", backgroundColor: "#28a745", fontSize: 10, color: "white" }}
                  size="small">
                  ??????????????????
                </Button>
              }
              <IconButton onClick={() => deleteCategory(category, id)} style={{ padding: "5px" }}>
                <DeleteIcon style={{ color: "FireBrick" }} />
              </IconButton>
            </Grid>
            {category.open === true &&
              <Fragment>
                <Grid item xs={1} />
                <Grid item xs={1} />
                <Grid item xs={6}>
                  <TextField
                    style={{ paddingTop: "5px" }}
                    fullWidth
                    value={category.subName}
                    classes={{
                      root: classesAC.root,
                    }}
                    onChange={(e) => subNameChange(e.target.value, category.id)}
                    placeholder="???????????????? ????????????????????????"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={2} style={{ paddingTop: "10px" }}>
                  <button
                    className="btn btn-success btn-block"
                    onClick={() => saveSubcategory(category.id)}
                  >
                    ????????????????
                  </button>
                </Grid>
                <Grid item xs={2} />
                {
                  category.child.length > 0 &&
                  <SecondLevel
                    number={id + 1}
                    subcategories={category.child}
                    parentid={category.parentid}
                    setParentCategories={setCategories}
                    parentCategories={categories}
                  />
                }
              </Fragment>
            }
            <Grid item xs={12}>
              <hr style={{ margin: "0px" }} />
            </Grid>
          </Fragment>
        ))}
      </Grid>
      <Grid container spacing={1} >
        <Grid item xs={12} style={{ paddingTop: "15px", paddingBottom: "15px" }}>
          <Link color="inherit" href="#" onClick={() => setShowDeleted(!showDeleted)}>{!showDeleted ? "???????????????? ?????????????????? ??????????????????" : "???????????? ?????????????????? ??????????????????"}</Link>
        </Grid>
        {
          showDeleted &&
          <DeletedCategories
            deletedCategories={deletedCategories}
            getCategories={getCategories}
          />
        }
      </Grid>
    </Fragment >
  )
}