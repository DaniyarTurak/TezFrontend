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

export default function ThirdLevel({ categories, updateCategory, deleteCategory, getCategories }) {

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
            temp.push({ ...cat, name_temp: cat.name, isAddingSub: false, subName: "" })
        });
        setSubCategories(temp);
    }, [categories]);


    const nameChange = (value, id) => {
        setSubCategories(prevState => {
            let obj = prevState[id];
            obj.name = value;
            return [...prevState];
        });
    };

    return (
        <Fragment>
            <Grid container spacing={0}>
                {subCategories.map((subcat, id) => (
                    <Fragment key={subcat.id}>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                value={subcat.name}
                                classes={{
                                    root: classesAC.root,
                                }}
                                onChange={(e) => nameChange(e.target.value, id)}
                                placeholder="Название подкатегории"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={4} style={{ textAlign: "right" }}>
                            {subcat.name !== subcat.name_temp &&
                                <IconButton onClick={() => updateCategory(subcat)}>
                                    <SaveIcon />
                                </IconButton>
                            }
                            <IconButton onClick={() => deleteCategory(subcat)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Fragment>
                ))}
            </Grid>
            <hr />
        </Fragment>
    )
}