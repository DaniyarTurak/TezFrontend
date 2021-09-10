import React, { Fragment, useEffect, useState } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Axios from "axios";
import Alert from "react-s-alert";

export default function Fifth({ subcategories, number, number2, number3, number4, parentid, parentCategories, setParentCategories }) {

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
            temp.push({ ...cat, name_temp: cat.name, isAddingSub: false, subName: "", deleted: cat.deleted, open: false })
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
                <Fragment key={category.id}>
                    <Grid item xs={1} />
                    <Grid item xs={1} />
                    <Grid item xs={1} />
                    <Grid item xs={1} />
                    <Grid item xs={1} style={{ textAlign: "right" }}>
                        {number}.{number2}.{number3}.{number4}.{id + 1} &emsp;
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
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
                        <IconButton onClick={() => deleteCategory(category, id)} style={{ padding: "5px" }}>
                            <DeleteIcon style={{ color: "FireBrick" }} />
                        </IconButton>
                    </Grid>
                </Fragment>
            ))}
            <hr />
        </Fragment>
    )
};