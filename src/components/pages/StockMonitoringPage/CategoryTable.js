import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import TablePagination from "@material-ui/core/TablePagination";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import IconButton from "@material-ui/core/IconButton";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';
import InputBase from '@material-ui/core/InputBase';
import Axios from "axios";
import Alert from "react-s-alert";
import TableSkeleton from '../../Skeletons/TableSkeleton';
import ErrorAlert from "../../ReusableComponents/ErrorAlert";

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const UnitsInput = withStyles((theme) => ({
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        width: '150px',
        padding: '5px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderColor: "#17a2b8",
        },
    },
}))(InputBase);

//вся эта функция TablePaginationActions используется исключительно для того чтобы иметь возможность
//перепригивать между последней и первой страницей в пагинации. Ridiculous.
function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
};

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
//конец пагинации

export default function CategoryTable({ categories, getMinimalStock, enabled, setEnabled }) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [categors, setCategors] = useState([]);
    const [isSending, setSending] = useState(false);

    useEffect(() => {
        if (categories && categories.length !== 0) {
            let arr = [];
            categories.forEach((element, i) => {
                arr.push({ ...element, indx: i + 1, editing: false, temp_units: element.units })
            });
            setCategors(arr);
        }
    }, [categories]
    );

    const StyledTableCell = withStyles((theme) => ({
        head: {
            background: "#17a2b8",
            color: theme.palette.common.white,
            fontSize: ".875rem",
        },
        body: {
            fontSize: ".875rem",
        },
        footer: {
            fontSize: ".875rem",
            fontWeight: "bold",
        },
    }))(TableCell);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const editMinCount = (idx) => {
        setCategors(prevState => {
            let obj = prevState[idx];
            obj.editing = !obj.editing;
            return [...prevState];
        })
        checkState();
    };

    const unitsChange = (value, idx) => {
        setCategors(prevState => {
            let obj = prevState[idx - 1];
            obj.temp_units = value;
            return [...prevState];
        });
    };

    const cancelChanges = (idx) => {
        setCategors(prevState => {
            let obj = prevState[idx];
            obj.temp_units = obj.units;
            obj.editing = false;
            return [...prevState];
        });
        checkState();
    };

    const saveUnits = (idx) => {
        let category = {};
        setCategors(prevState => {
            let obj = prevState[idx];
            if (Number(obj.temp_units).toString() !== "NaN") {
                obj.units = obj.temp_units;
                obj.editing = false;
                category = { id: obj.stockm_id, units: obj.units };
                return [...prevState];
            }
            else {
                ErrorAlert("Введите корректное значение")
                return [...prevState];
            }
        });
        if (JSON.stringify(category) !== "{}") {
            sendChanges(category);
        }
        checkState();
    };

    const sendChanges = (category) => {
        setSending(true);
        Axios.post("/api/stock/stockm/update", category)
            .then((result) => result.data)
            .then((result) => {
                Alert.success("Минимальный остаток успешно установлен", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setSending(false);
                getMinimalStock();
            })
            .catch((err) => {
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.code === "error"
                ) {
                    Alert.error(err.response.data.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setSending(false);
                }
                else {
                    Alert.error("Возникла ошибка при обработке вашего запроса.", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setSending(false);
                }
            });
    };

    const checkState = () => {
        let state = true;
        categors.forEach(element => {
            if (element.editing) {
                state = false;
            }
        });
        setEnabled(state);
    };

    const deleteCategory = (id) => {
        setSending(true);
        Axios.post("/api/stock/stockm/delete", { id: id, type: 2 })
            .then((result) => result.data)
            .then((result) => {
                Alert.success("Минимальный остаток успешно удалён", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setSending(false);
                getMinimalStock();
            })
            .catch((err) => {
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.code === "error"
                ) {
                    Alert.error(err.response.data.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setSending(false);
                }
                else {
                    Alert.error("Возникла ошибка при обработке вашего запроса.", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setSending(false);
                }
            });
    };

    return (
        <Fragment>
            <Grid item xs={12}>
                {categors.length === 0 &&
                    <TableSkeleton />
                }
                {categors.length > 0 &&
                    <Fragment>
                        <TableContainer component={Paper} style={{ boxShadow: "0px -1px 1px 1px white" }}>
                            <Table id="table-to-xls">
                                <TableHead >
                                    <TableRow style={{ fontWeight: "bold" }} >
                                        <StyledTableCell rowSpan="2" />
                                        <StyledTableCell rowSpan="2" align="center">
                                            Наименование категории
                                </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center">
                                            Минимальный остаток
                                </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categors
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((catgr, idx) => (
                                            <TableRow key={idx}>
                                                <StyledTableCell>{catgr.indx}</StyledTableCell>
                                                <StyledTableCell align="center">{catgr.name}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {catgr.editing === true ?
                                                        <UnitsInput
                                                            variant="outlined"
                                                            autoFocus={true}
                                                            value={catgr.temp_units}
                                                            onChange={(e) => unitsChange(e.target.value, catgr.indx)}
                                                        /> : catgr.units
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {catgr.editing &&
                                                        <IconButton
                                                            onClick={() => saveUnits(catgr.indx - 1)}
                                                            disabled={isSending}
                                                        >
                                                            <DoneIcon fontSize="small" title="Сохранить" />
                                                        </IconButton>
                                                    }
                                                    {!catgr.editing &&
                                                        <IconButton onClick={() => editMinCount(catgr.indx - 1)}>
                                                            <EditIcon fontSize="small" title="Редактировать" />
                                                        </IconButton>
                                                    }
                                                    &nbsp;
                                                    {!catgr.editing &&
                                                        <IconButton
                                                            onClick={() => deleteCategory(catgr.stockm_id)}
                                                        >
                                                            <DeleteIcon fontSize="small" title="Удалить" />
                                                        </IconButton>
                                                    }
                                                    {catgr.editing &&
                                                        <IconButton onClick={() => cancelChanges(catgr.indx - 1)}>
                                                            <CancelIcon fontSize="small" title="Отмена" />
                                                        </IconButton>
                                                    }
                                                </StyledTableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {enabled &&
                            <TablePagination
                                rowsPerPageOptions={[10, 20, 50]}
                                component="div"
                                count={categories.length}
                                backIconButtonText="Предыдущая страница"
                                labelRowsPerPage="Строк в странице"
                                nextIconButtonText="Следующая страница"
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        }
                    </Fragment>}
            </Grid>
        </Fragment>
    );
}
