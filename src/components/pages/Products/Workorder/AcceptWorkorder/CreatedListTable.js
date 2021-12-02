
import React, { Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Moment from "moment";
import VisibilityIcon from '@material-ui/icons/Visibility';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Axios from "axios";
import Alert from "react-s-alert";
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 5,
        borderRadius: 2,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 2,
        backgroundColor: '#17a2b8',
    },
}))(LinearProgress);

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

export default function AcceptedListTable({
    workorderList,
    setWorkorderId,
    setOnlyView,
    setActivePage,
    isLoading,
    getWorkorders
}) {

    const addToAccepting = (id) => {
        Axios.post("/api/workorder/manage", {
            workorder_id: id,
            status: 'INPROCESS'
        })
            .then((res) => res.data)
            .then((res) => {
                getWorkorders();
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

    const deleteFromAccepting = (id) => {
        Axios.post("/api/workorder/manage", {
            workorder_id: id,
            status: 'CREATED'
        })
            .then((res) => res.data)
            .then((res) => {
                getWorkorders();
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

    const acceptWorkorders = () => {
        let flag = false;
        workorderList.forEach(el => {
            if (el.status === 'INPROCESS') {
                flag = true;
            }
        });
        if (!flag) {
            Alert.warning('В обработке нет наряд-заказов', {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
        else {
            setActivePage(2)
        }
    }

    return (
        <Fragment>
            <Grid
                container
                spacing={2}
            >
                {isLoading &&
                    <Grid item xs={12}>
                        <BorderLinearProgress />
                    </Grid>
                }
                {workorderList.length === 0 && !isLoading &&
                    <Grid item xs={12}>
                        У Вас пока нет необработанных наряд-заказов
                    </Grid>
                }
                {!isLoading && workorderList.length > 0 &&
                    <Fragment>
                        <Grid item xs={12}>
                            <TableContainer
                                component={Paper}
                                style={{ boxShadow: "0px -1px 1px 1px white" }}
                            >
                                <Table id="table-to-xls">
                                    <TableHead>
                                        <TableRow style={{ fontWeight: "bold" }} >
                                            <StyledTableCell align="center">
                                                № наряд-заказа
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                Торговая точка
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                Пользователь
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                Дата создания
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                Статус
                                            </StyledTableCell>
                                            <StyledTableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {workorderList
                                            .map((wo, idx) => (
                                                <TableRow key={idx}>
                                                    <StyledTableCell align="center">
                                                        {wo.workorder_number}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {wo.point_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {wo.username}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {Moment(wo.date).format("DD.MM.YYYY HH:mm:ss")}
                                                    </StyledTableCell >
                                                    <StyledTableCell align="center">
                                                        {wo.status === 'INPROCESS' ? <span style={{ color: "#28a745" }}> Добавлен к обработке </span> :
                                                            <span style={{ color: "#17a2b8" }}> Создан </span>
                                                        }
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <IconButton
                                                            title="Посмотреть"
                                                            onClick={() => { setWorkorderId(wo.id); setOnlyView(true); setActivePage(2) }}>
                                                            <VisibilityIcon
                                                                size="small"
                                                            />
                                                        </IconButton>
                                                        {wo.status === 'CREATED' ?
                                                            <IconButton
                                                                onClick={() => { addToAccepting(wo.id) }}
                                                                title="Добавить в обработку"
                                                            >
                                                                <AddBoxIcon size="small" />
                                                            </IconButton>
                                                            : wo.status === 'INPROCESS' ?
                                                                <IconButton
                                                                    onClick={() => { deleteFromAccepting(wo.id) }}
                                                                    title="Убрать из обработки"
                                                                >
                                                                    <IndeterminateCheckBoxIcon size="small" />
                                                                </IconButton> : ""
                                                        }
                                                    </StyledTableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: 'center' }}>
                            <button
                                className="btn btn-success"
                                onClick={acceptWorkorders}
                            >
                                Обработать наряд-заказы
                            </button>
                        </Grid>
                    </Fragment>
                }
            </Grid>
        </Fragment >
    )
};