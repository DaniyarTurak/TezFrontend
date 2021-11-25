
import React, { useState, useEffect, Fragment } from "react";
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
import Breadcrumb from "../../../Breadcrumb";
import LinearProgress from '@material-ui/core/LinearProgress';
import Axios from "axios";

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
    isLoading
}) {

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
                        У Вас пока нет заказ-нарядов
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
                                                № заказ-наряда
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
                                                    <StyledTableCell align="right">
                                                        <IconButton onClick={() => { setWorkorderId(wo.id); setOnlyView(true); setActivePage(2) }}>
                                                            <VisibilityIcon size="small" />
                                                        </IconButton>
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
                                onClick={() => setActivePage(2)}
                            >
                                Обработать заказ-наряды
                            </button>
                        </Grid>
                    </Fragment>
                }
            </Grid>
        </Fragment >
    )
};