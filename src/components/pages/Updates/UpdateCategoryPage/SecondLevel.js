import React, { Fragment, useEffect, useState } from "react";
import { withStyles, makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import Axios from "axios";
import Alert from "react-s-alert";
import ThirdLevel from './ThirdLevel';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function SecondLevel({ categories, updateCategory, deleteCategory, getCategories }) {

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

    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        let temp = [];
        categories.forEach(cat => {
            temp.push({ ...cat, name_temp: cat.name, isAddingSub: false, subName: "", open: false })
        });
        setSubCategories(temp);
    }, [categories]);

    const addSubcategory = (id) => {
        setSubCategories(prevState => {
            let obj = prevState[id];
            obj.isAddingSub = true;
            return [...prevState];
        })
    };

    const subNameChange = (value, id) => {
        setSubCategories(prevState => {
            let obj = prevState[id];
            obj.name = value;
            return [...prevState];
        });
    };

    const nameChange = (value, id) => {
        setSubCategories(prevState => {
            let obj = prevState[id];
            obj.name = value;
            return [...prevState];
        });
    };

    const saveSubcategory = (cat) => {
        const category = {
            name: cat.name,
            deleted: false,
            parent_id: cat.parentid,
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

    const cancelAdd = (id) => {
        setSubCategories(prevState => {
            let obj = prevState[id];
            obj.isAddingSub = false;
            return [...prevState];
        })
    };

    const expandSubcategories = (idx) => {
        setSubCategories(prevState => {
            let obj = prevState[idx];
            obj.open = !obj.open;
            return [...prevState];
        })
    };



    return (
        <Fragment>

            {subCategories.map((category, id) => (
                <Fragment>
                    <Grid item xs={1} />
                    <Grid item xs={1}>
                        <IconButton onClick={() => expandSubcategories(id)}>
                            {category.open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            style={{ paddingTop: "5px" }}
                            fullWidth
                            value={category.name}
                            classes={{
                                root: classesAC.root,
                            }}
                            onChange={(e) => subNameChange(e.target.value, id)}
                            placeholder="Название подкатегории"
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
                            <Grid item xs={1} />
                            <Grid item xs={5}>
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
                            <Grid item xs={1} />
                            <Grid item xs={1} />
                            {
                                category.child.lenght > 0 &&
                                <Fragment>
                                    {category.child.map((cat) => (
                                        <Fragment>
                                            <Grid item xs={1} />
                                            <Grid item xs={1} />
                                            <Grid item xs={1}>
                                                <ChevronRightIcon />
                                            </Grid>
                                            <Grid item xs={9}>
                                                {cat.name}
                                            </Grid>
                                        </Fragment>
                                    )
                                    )}
                                </Fragment>
                            }
                        </Fragment>
                    }
                </Fragment>
            ))
            }
        </Fragment>
        // <Fragment>
        //     <Grid container spacing={1}>
        //         {subCategories.map((subcat, id) => (
        //             <Fragment key={subcat.id}>
        //                 <Grid item xs={9}>
        //                     <TextField
        //                         fullWidth
        //                         value={subcat.name}
        //                         classes={{
        //                             root: classesAC.root,
        //                         }}
        //                         onChange={(e) => nameChange(e.target.value, id)}
        //                         placeholder="Название подкатегории"
        //                         variant="outlined"
        //                         size="small"
        //                     />
        //                 </Grid>
        //                 <Grid item xs={3} style={{ textAlign: "right" }}>
        //                     {subcat.name !== subcat.name_temp &&
        //                         <IconButton onClick={() => updateCategory(subcat)}>
        //                             <SaveIcon />
        //                         </IconButton>
        //                     }
        //                     <IconButton onClick={() => deleteCategory(subcat)}>
        //                         <DeleteIcon />
        //                     </IconButton>
        //                 </Grid>
        //                 {!subcat.isAddingSub &&
        //                     <Grid item xs={12}>
        //                         <Button
        //                             onClick={() => addSubcategory(id)}
        //                         >
        //                             <AddCircleIcon />
        //                             &emsp; Добавить подкатегорию
        //                         </Button>
        //                     </Grid>
        //                 }
        //                 {subcat.isAddingSub &&
        //                     <Fragment>
        //                         <Grid item xs={7}>
        //                             <TextField
        //                                 fullWidth
        //                                 value={subcat.subName}
        //                                 classes={{
        //                                     root: classesAC.root,
        //                                 }}
        //                                 onChange={(e) => subNameChange(e.target.value, id)}
        //                                 placeholder="Название подкатегории"
        //                                 variant="outlined"
        //                                 size="small"
        //                             />
        //                         </Grid>
        //                         <Grid item xs={5}>
        //                             <ButtonGroup>
        //                                 <button
        //                                     className="btn btn-success"
        //                                     onClick={() => saveSubcategory(subcat)}
        //                                 >
        //                                     <AddCircleIcon />
        //                                 </button>
        //                                 &nbsp;
        //                                 <button
        //                                     className="btn btn-secondary"
        //                                     onClick={() => cancelAdd(id)}
        //                                 >
        //                                     <CancelIcon />

        //                                 </button>
        //                             </ButtonGroup>
        //                         </Grid>
        //                     </Fragment>}
        //                 {subcat.child.length > 0 &&
        //                     <Fragment>
        //                         <Grid item xs={2} />
        //                         <Grid item xs={10}>
        //                             <ThirdLevel
        //                                 categories={subcat.child}
        //                                 deleteCategory={deleteCategory}
        //                                 updateCategory={updateCategory}
        //                                 getCategories={getCategories}
        //                             />
        //                         </Grid>
        //                     </Fragment>
        //                 }
        //             </Fragment>
        //         ))}
        //     </Grid>
        //     <hr />
        // </Fragment>
    )
}