import React, { Fragment, useEffect, useState } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Axios from "axios";
import Alert from "react-s-alert";
import ThirdLevel from './ThirdLevel';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

export default function SecondLevel({ subcategories, number, parentid, parentCategories, setParentCategories }) {

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

    useEffect(() => {
        let temp = [];
        subcategories.forEach(cat => {
            temp.push({ ...cat, name_temp: cat.name, isAddingSub: false, subName: "", open: false, deleted: cat.deleted })
        });
        setCategories(temp);
    }, [subcategories]);

    const nameChange = (value, id) => {
        setCategories(prevState => {
            let obj = prevState[id];
            obj.name = value;
            return [...prevState];
        });
    };

    const saveSubcategory = (cat, id) => {
        const category = {
            name: cat.subName,
            deleted: false,
            parent_id: cat.id,
        };
        Axios.post("/api/categories/updatecategories", { category })
            .then((res) => {
                if (res.data.code === "success") {
                    Alert.success("Категория успешно обновлена", {
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
                    })
                }
                else {
                    Alert.error(res.data.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                }
            })
            .catch((err) => {
                Alert.error("Такая категория уже существует", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
            });
    };

    const expandSubcategories = (idx) => {
        setCategories(prevState => {
            let obj = prevState[idx];
            obj.open = !obj.open;
            return [...prevState];
        })
    };

    const subNameChange = (value, id) => {
        setCategories(prevState => {
            let obj = prevState[id];
            obj.subName = value;
            return [...prevState];
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
                parent_id: cat.parentid
            };
            Axios.post("/api/categories/updatecategories", { category })
                .then(() => {
                    Alert.success("Категория успешно удалена", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });

                    let temp = categories;
                    let temp2 = [];
                    temp.forEach(el => {
                        if (el.id !== cat.id) {
                            temp2.push(el)
                        }
                    });
                    let id;
                    parentCategories.forEach((el, idx) => {
                        if (el.id === cat.parentid) {
                            id = idx
                        }
                    })
                    setParentCategories(prevState => {
                        let obj = prevState[id];
                        obj.child = temp2;
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
        }
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
                Alert.success("Категория успешно обновлена", {
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

    return (
        <Fragment>
            {categories.map((category, id) => (
                !category.deleted &&
                <Fragment key={id}>
                    <Grid item xs={1} />
                    <Grid item xs={1} style={{ textAlign: "right" }}>
                        {number}.{id + 1} &emsp;
                        <IconButton onClick={() => expandSubcategories(id)} style={{ padding: "5px" }}>
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
                            onChange={(e) => nameChange(e.target.value, id)}
                            placeholder="Название подкатегории"
                            variant="outlined"
                            size="small"
                            inputProps={{
                                style: { padding: "5px" },
                            }}
                        />
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: "right" }}>
                        {category.name !== category.name_temp &&
                            <Button onClick={() => updateCategory(category, id)} style={{ padding: "5px", backgroundColor: "#28a745", fontSize: 10, color: "white" }} size="small">
                                Сохранить
                            </Button>
                        }
                        <IconButton onClick={() => deleteCategory(category)} style={{ padding: "5px" }}>
                            <DeleteIcon style={{ color: "FireBrick" }} />
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
                            <Grid item xs={2} style={{ paddingTop: "10px" }}>
                                <button
                                    fullwidth="true"
                                    className="btn btn-success btn-block"
                                    onClick={() => saveSubcategory(category, id)}
                                >
                                    Добавить
                                </button>
                            </Grid>
                            <Grid item xs={2} />
                            {
                                category.child.length > 0 &&
                                <ThirdLevel
                                    number={number}
                                    number2={id + 1}
                                    subcategories={category.child}
                                    parentid={category.parentid}
                                    setParentCategories={setCategories}
                                    parentCategories={categories}
                                />
                            }
                        </Fragment>
                    }
                </Fragment>
            ))
            }
        </Fragment>
    )
}