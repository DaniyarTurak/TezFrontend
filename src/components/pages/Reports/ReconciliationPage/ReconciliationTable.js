import React, { Fragment } from "react";
import Moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import "moment/locale/ru";
Moment.locale("ru");

export default function ReconciliationTable({ reconciliations, getDetails, selectedID }) {

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: "#17a2b8",
            color: theme.palette.common.white,
            fontSize: ".875rem",
        },
        body: {
            fontSize: ".875rem",
        },
        footer: {
            fontWeight: "bold",
            fontSize: ".875rem",
        },
    }))(TableCell);


    return (
        <Fragment>
            <Grid item xs={12}>
                <TableContainer component={Paper} style={{ boxShadow: "0px -1px 1px 1px white" }}>
                    <Table id="table-to-xls">
                        <TableHead >
                            <TableRow style={{ fontWeight: "bold" }} >
                                <StyledTableCell rowSpan="2" align="center" />
                                <StyledTableCell rowSpan="2" align="center">
                                    Номер сверки
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center">
                                    Дата начала
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center">
                                    Дата окончания
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center">
                                    Статус
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody style={{ cursor: "pointer" }}>
                            {reconciliations
                                .map((recon, idx) => (
                                    <TableRow
                                        key={recon.id}
                                        hover
                                        selected={selectedID === recon.id}
                                        onClick={() => getDetails(recon)}
                                    >
                                        <StyledTableCell align="center">{idx + 1}</StyledTableCell>
                                        <StyledTableCell align="center">{recon.id}</StyledTableCell>
                                        <StyledTableCell align="center">{Moment(recon.begin_date).format('LLL')}</StyledTableCell>
                                        <StyledTableCell align="center">{recon.end_date ? Moment(recon.end_date).format('LLL') : "-"}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            {recon.status === 0 ? <span style={{ color: "#fd7e14" }}>Не завершена</span> :
                                                recon.status === 1 ? <span style={{ color: "#28a745" }}>Завершена</span> :
                                                    <span style={{ color: "#dc3545" }}>Удалена</span>}
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Fragment>
    );
}
