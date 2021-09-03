import React, { Fragment, useEffect, useState } from "react";
import Axios from "axios";
import Alert from "react-s-alert";
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
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReplayIcon from '@material-ui/icons/Replay';
import SecondLevel from './SecondLevel';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import TreeItem from '@material-ui/lab/TreeItem';

export default function UpdateBonusPage() {

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

  const [categories, setCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [name, setName] = useState("");
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
            if (category.parentid === 0) {
              c.push({ ...category, name_temp: category.name, isAddingSub: false, subName: "", open: false });
            }
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
  };

  const updateCategory = (cat) => {
    const category = {
      name: cat.name,
      deleted: false,
      id: cat.id,
      parent_id: cat.parentid
    };
    Axios.post("/api/categories/updatecategories", { category })
      .then(() => {
        Alert.success("Категория успешно обновлена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        getCategories();
      })
      .catch((err) => {
        Alert.error(err, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  const saveSubcategory = (cat) => {
    const category = {
      name: cat.subName,
      deleted: false,
      parent_id: cat.id,
    };
    Axios.post("/api/categories/updatecategories", { category })
      .then(() => {
        Alert.success("Категория успешно обновлена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        getCategories();
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
        Alert.success("Категория успешно добавлена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
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

  const deleteCategory = (cat) => {
    if (cat.child.length > 0) {
      Alert.warning("Сначала необходимо удалить все подкатегории", {
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
        parent_id: 0
      };
      Axios.post("/api/categories/updatecategories", { category })
        .then(() => {
          Alert.success("Категория успешно удалена", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          getCategories();
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

  const recoverCategory = (cat) => {
    const category = {
      name: cat.name,
      deleted: false,
      id: cat.id,
      parent_id: 0
    };
    Axios.post("/api/categories/updatecategories", { category })
      .then(() => {
        Alert.success("Категория успешно удалена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        getCategories();
      })
      .catch((err) => {
        Alert.error(err, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  const openChildren = (idx) => {
    setCategories(prevState => {
      let obj = prevState[idx];
      obj.open = true;
      return [...prevState];
    })
  };

  const closeChildren = (idx) => {
    setCategories(prevState => {
      let obj = prevState[idx];
      obj.open = false;
      return [...prevState];
    })
  };

  const expandSubcategories = (idx) => {
    setCategories(prevState => {
      let obj = prevState[idx];
      obj.open = !obj.open;
      return [...prevState];
    })
  };

  return (
    <Fragment>
      <Grid container spacing={2}>
        {categories.map((category, id) => (
          <Fragment key={category.id} >
            <Grid item xs={1}>
              <IconButton onClick={() => expandSubcategories(id)}>
                {category.open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Grid>
            <Grid item xs={9}>
              <TextField
                style={{ paddingTop: "5px" }}
                fullWidth
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
            <Grid item xs={2} style={{ textAlign: "right" }}>
              {category.name !== category.name_temp &&
                <IconButton onClick={() => updateCategory(category)}>
                  <SaveIcon />
                </IconButton>
              }
              <IconButton onClick={() => deleteCategory(category)}>
                <DeleteIcon />
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
                    // value={category.name}
                    classes={{
                      root: classesAC.root,
                    }}
                    // onChange={(e) => subNameChange(e.target.value, id)}
                    placeholder="Название подкатегории"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={1} style={{ paddingTop: "14px" }}>
                  <button
                    fullWidth
                    className="btn btn-success"
                    onClick={() => saveSubcategory(category)}
                  >
                    Добавить
                  </button>
                </Grid>
                <Grid item xs={2}>
                </Grid>
                {
                  category.child.length > 0 &&
                  <SecondLevel categories={category.child} />
                }
              </Fragment>

            }
          </Fragment>
        ))}
      </Grid>

      {/* <TreeList
        data={DATA}
        columns={COLUMNS}
        options={OPTIONS}
        handlers={{}}
        id={'id'}
        parentId={'parentId'}></TreeList> */}
      {/* <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Grid container spacing={2}>
              <Grid item xs={1} />
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  value={name}
                  classes={{
                    root: classesAC.root,
                  }}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Название категории"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={5}>
                <button
                  className="btn btn-success"
                  onClick={newCategory}
                >
                  Добавить
                </button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>


        {categories.map((category, id) => (
          <Grid item xs={12} key={category.id}>
            <Paper>
              <Grid container spacing={1}>
                <Grid item xs={1} style={{ textAlign: "center" }}>
                  {id + 1}
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
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
                <Grid item xs={2} style={{ textAlign: "right" }}>
                  {category.name !== category.name_temp &&
                    <IconButton onClick={() => updateCategory(category)}>
                      <SaveIcon />
                    </IconButton>
                  }
                  <IconButton onClick={() => deleteCategory(category)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>


                <Grid item xs={1} />
                {!category.isAddingSub &&
                  <Grid item xs={11} style={{ cursor: "pointer" }}>
                    <Button
                      onClick={() => addSubcategory(id)}
                    >
                      <AddCircleIcon />
                      &emsp; Добавить подкатегорию
                    </Button>
                  </Grid>}
                {category.isAddingSub &&
                  <Fragment>
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
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
                    <Grid item xs={4}>
                      <button
                        className="btn btn-success"
                        onClick={() => saveSubcategory(category)}
                      >
                        <AddCircleIcon />
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-secondary"
                        onClick={() => cancelAdd(id)}
                      >
                        <CancelIcon />

                      </button>
                    </Grid>
                  </Fragment>}

                {category.child.length > 0 &&
                  <Fragment>
                    <Grid item xs={2} />
                    <Grid item xs={10}>
                      <SecondLevel
                        categories={category.child}
                        deleteCategory={deleteCategory}
                        updateCategory={updateCategory}
                        getCategories={getCategories}
                      />
                    </Grid>
                  </Fragment>
                }
              </Grid>
            </Paper>
          </Grid>
        ))}


        <Grid item xs={12} >
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              Удалённые категории
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {deletedCategories.map((category, id) => (
                  <Grid item xs={12} key={category.id}>
                    <Paper>
                      <Grid container spacing={2}>
                        <Grid item xs={1} style={{ textAlign: "center", verticalAlign: "middle", display: 'flex' }}>
                          {id + 1}
                        </Grid>
                        <Grid item xs={6}>
                          {category.name}
                        </Grid>
                        <Grid item xs={5} style={{ textAlign: "right" }}>
                          <IconButton onClick={() => recoverCategory(category)}>
                            <ReplayIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid> */}
    </Fragment >
  )
}