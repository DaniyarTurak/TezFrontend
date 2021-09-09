import React, { Fragment, useEffect, useState } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';
import Axios from "axios";
import Alert from "react-s-alert";
import Button from '@material-ui/core/Button';

export default function DeletedCategories({ deletedCategories, getCategories }) {


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
        console.log(deletedCategories);
    }, [deletedCategories]);

    const recoverCategory = (cat) => {
        const category = {
            name: cat.name,
            deleted: false,
            id: cat.id,
            parent_id: 0
        };
        console.log(category);
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

    return (
        <Fragment>
            <Grid item xs={12} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <b>Удалённые категории</b>
            </Grid>
            {deletedCategories.map((category, id) => (
                <Fragment key={category.id}>
                    <Grid item xs={1} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <span>{id + 1}</span>
                    </Grid>
                    <Grid item xs={8} style={{ display: "flex", alignItems: "center" }}>
                        <span>{category.name}</span>
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: "right" }}>
                        <Button onClick={() => recoverCategory(category)} style={{ padding: "5px", backgroundColor: "#17a2b8", fontSize: 10, color: "white" }} size="small">
                            Восстановить
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <hr style={{ margin: "0px" }} />
                    </Grid>
                </Fragment>
            ))}
            <hr />
        </Fragment>
    )
};