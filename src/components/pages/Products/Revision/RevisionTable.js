import React, { useState, useEffect, Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from '@material-ui/icons/Save';
import TablePagination from "@material-ui/core/TablePagination";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import PropTypes from "prop-types";
import Alert from "react-s-alert";
import EditUnits from "./EditUnits"
import ReactModal from "react-modal";
import Axios from "axios";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        marginLeft: "40px",
        transform: "translate(-50%, -50%)",
        maxWidth: "400px",
        maxHeight: "80vh",
        overlfow: "scroll",
        zIndex: 11,
    },
    overlay: { zIndex: 10 },
};

ReactModal.setAppElement("#root");
const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

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


export default function RevisonProducts({
    revisionProducts,
    setRevisionProducts,
    point,
    revNumber,
    getRevisionProducts,
    activeStep,
    isOutOfRevision
}) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isEditingUnits, setEditingUnits] = useState(false);
    const [product, setProduct] = useState({});
    const [isLoading, setLoading] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const editUnits = (product) => {
        setProduct(product);
        setEditingUnits(true);
    };

    const deleteProduct = (product) => {
        setLoading(true);
        Axios.post("/api/revision/revisiontemp/delete", { revnumber: revNumber, product: product.product, attributes: product.attributes })
            .then((res) => res.data)
            .then((res) => {
                if (res.command && res.command === "DELETE") {
                    Alert.success("Товар удалён из ревизии", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setLoading(false);
                    getRevisionProducts();
                    setEditingUnits(false);

                } else {
                    Alert.error("Возникла непредвиденная ошибка", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setLoading(false);

                }
            })
            .catch((err) => {
                console.log(err);
                Alert.error(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setLoading(false);
            });
    }

    return (
        <Fragment>
            <TableContainer
                component={Paper}
                style={{ boxShadow: "0px -1px 1px 1px white" }}
            >
                <Table id="table-to-xls">
                    <TableHead>
                        <TableRow style={{ fontWeight: "bold" }} >
                            {activeStep === 2 && <StyledTableCell align="center">
                                Штрих-код
                            </StyledTableCell>}
                            <StyledTableCell align="center">
                                Наименование
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                {isOutOfRevision ? "Количество" : " Отсканированное количество"}
                            </StyledTableCell>
                            {activeStep !== 2 && <StyledTableCell />}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {revisionProducts
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((product, idx) => (
                                <TableRow key={idx}>
                                    {activeStep === 2 && <StyledTableCell>
                                        {product.code}
                                    </StyledTableCell>}
                                    <StyledTableCell>
                                        {product.name} {activeStep !== 2 ? " (" + product.code + ")" : ""} <br />
                                        {product.attributescaption !== "" ? product.attributescaption : ""}
                                        {product.attrvalue !== "" ? product.attrvalue : ""}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {parseFloat(product.units).toLocaleString(
                                            "ru",
                                            { minimumFractionDigits: 1 }
                                        )}
                                    </StyledTableCell>
                                    {activeStep !== 2 &&
                                        <StyledTableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    editUnits(product);
                                                }}>
                                                {product.isChanging ? <SaveIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                                            </IconButton>
                                            <IconButton size="small"
                                                onClick={() => {
                                                    deleteProduct(product);
                                                }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </StyledTableCell>}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={revisionProducts.length}
                backIconButtonText="Предыдущая страница"
                labelRowsPerPage="Строк в странице"
                nextIconButtonText="Следующая страница"
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
            />
            <ReactModal
                isOpen={isEditingUnits}
                style={customStyles}
            >
                <EditUnits
                    product={product}
                    point={point}
                    revNumber={revNumber}
                    isEditingUnits={isEditingUnits}
                    setEditingUnits={setEditingUnits}
                    getRevisionProducts={getRevisionProducts}
                />
            </ReactModal>
        </Fragment>
    )
};
