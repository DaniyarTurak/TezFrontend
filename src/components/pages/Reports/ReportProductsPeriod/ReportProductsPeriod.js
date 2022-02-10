import React, { useState, useEffect, Fragment} from 'react';
import Axios from "axios";
import ProductTable from "./ProductTable";
import ProductOptions from "./ProductOptions";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "react-s-alert";
import Moment from "moment";

const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "500px",
      zIndex: 11,
    },
    overlay: { zIndex: 10 },
};

const useStyles = makeStyles((theme) => ({
    notFound: { textAlign: "center", color: theme.palette.text.secondary },
    hover: {
      cursor: "pointer",
      color: "#162ece",
      "&:hover": {
        color: "#09135b",
      },
    },
}));

export default function ReportProductPerTransfer({ companyProps }) {

    const classes = useStyles();
    const [date, setDate] = useState(new Date());
    const [activePage, setActivePage] = useState(0);
    const [attribute, setAttribute] = useState({
        value: "@",
        label: "Все",
        format: "",
    });
    const [attributes, setAttributes] = useState([]);
    const [attributeTypes, setAttributeTypes] = useState([]);
    const [attrval, setAttrVal] = useState("");
    const [dateAttrval, setDateAttrval] = useState(null);
    const [selectedStock, setSelectedStock] = useState({
        value: "0",
        label: "Все",
    });
    const [stockList, setStockList] = useState([]);

    const [productsperiod, setProductsPeriod] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [isPaginationLoading, setPaginationLoading] = useState(false);

    const [flag, setFlag] = useState(true);

    const company = companyProps ? companyProps.value : "";

    useEffect(() => {
        if(!company) {
            getAttributes();
            //getProductsPeriod();
            getStockList();
        }
    }, [])

    useEffect(() => {
        if(company) {
            getAttributes();
            //getProductsPeriod();
            getStockList();
        }
    }, [company])

    useEffect(() => {
        if (isPaginationLoading) {
          handleSearch();
        }
        return () => {
          setPaginationLoading(false);
        };
      }, [activePage, itemsPerPage]);

    const handleSearch = () => {
        if (Moment(date).isBefore("2019-11-06")) {
          return Alert.warning(
            `Дата для запроса слишком старая. Исторические данные доступны, начиная с 25 ноября 2019 года`,
            {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 3000,
            }
          );
        } else if (!date) {
          return Alert.warning(`Заполните дату`, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        }
    
        // if (!selectedStock) {
        //   return Alert.warning("Выберите склад", {
        //     position: "top-right",
        //     effect: "bouncyflip",
        //     timeout: 3000,
        //   });
        // }

        setProductsPeriod([]);
        getProductsPeriod();
    };

    const handlePageChange = (event, pN) => {
        setFlag(false);
        setPaginationLoading(true);
        setActivePage(pN);
    };

    const handleChangeRowsPerPage = (event) => {
        setFlag(true);
        setPaginationLoading(true);
        setItemsPerPage(+event.target.value);
        setActivePage(0);
    };

    // { params: { 
    //     month: date.getMonth() + 1, // 1
    //     year: date.getFullYear(), // 2021
    //     //point: selectedStock.value === 0 ? null : selectedStock.value, // 189 
    //     //attribute: attribute.value === '@' ? null : attribute.value, // 1
    //     //value: attribute.value !== '@' ? (attribute.format === 'DATE' ? dateAttrval : attrval) : null, // 1
    // }}

    const getProductsPeriod = () => {
        setLoading(false);
        let val;
        if (attribute.format === 'DATE') {
            val = dateAttrval || '';
        } else {
            val = attrval || '';
        }

        const page = activePage ? activePage + 1 : 1;

        Axios.get(`http://tezportal.ddns.net/api/report/movement/product?month=${date.getMonth() + 1}&year=${date.getFullYear()}${selectedStock.value === '0' ? `` : `&point=${selectedStock.value}`}${attribute.value === '@' ? `` : `&attribute=${attribute.value}`}${val ? `&value=${val}` : ``}`)
        .then((res) => res.data)
        .then((res) => {
            console.log("Res data: ", res.data);
            return res.data;
        })
        .then((productsList) => {
            setLoading(true);
            setProductsPeriod(productsList);
            setPaginationLoading(false);
            console.log("Products: ", productsList);
        })
        .catch((err) => {
            console.log("The Errro: ", err)
            setPaginationLoading(false);
            ErrorAlert(err);
        })
    }

    const getAttributes = () => {
        Axios.get("/api/attributes", { params: { deleted: false, company } })
        .then((res) => res.data)
        .then((attributes) => {
            const all = [{ label: "Все", value: "@" }];
            const attr = attributes.map((point) => {
                return {
                    value: point.id,
                    label: point.values,
                    format: point.format
                };
            });

            const spr = [];
            attributes.forEach((point) => {
                for (let i=0; i<point.sprvalues.length; i++) {
                    spr.push({
                        value: point.id,
                        label: point.sprvalues[i],
                        format: point.format
                    });    
                }
            })

            setAttributes([...all, ...attr]);
        })
        .catch((err) => {
            ErrorAlert(err);
        });
    }

    const getAttributeTypes = (sprid) => {
        if (Number.isInteger(sprid)) {
            Axios.get("/api/attributes/getsprattr", { params: { sprid, company } })
            .then((res) => res.data)
            .then((attributeTypes) => {
                const all = [{ label: "Все", value: -1 }];
                const attrtype = attributeTypes.map((attrtype) => {
                    return {
                        value: attrtype.id,
                        label: attrtype.value,
                        deleted: attrtype.deleted,
                    };
                });
                let newattrtype = [];
                newattrtype = attrtype.filter((value) => {
                    return value.deleted === false;
                });
                setAttributeTypes([...all, ...newattrtype]);
            })
            .catch((err) => {
                ErrorAlert(err);
            });
        }
    };

    const getStockList = () => {
        Axios.get("/api/stock", { params: { company } })
          .then((res) => res.data)
          .then((stockList) => {
            const options = stockList.map((stock) => {
              return {
                value: stock.id,
                label: stock.name,
              };
            });
            const allStock = [{ value: "0", label: "Все" }];
            setStockList([...allStock, ...options]);
          })
          .catch((err) => {
            ErrorAlert(err);
          });
    };

    const postProductsPeriodExcel = () => {
        
        let today = new Date();
        const tableData = productsperiod.map(({ product, code, name, income, outcome, units }) => {
            return ({
                id: product,
                code,
                name,
                income,
                outcome,
                units,
            })
        });

        Axios.post('http://tezportal.ddns.net/api/report/movement/product/excel', {
            dat: `${today.getFullYear()}.${today.getMonth()}.${today.getDate()}`,
            company: company,
            products: tableData,
        }).then((res) => {
            console.log('Excel: ', res);
            Alert.success('Excel загрузилась!', {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 3000,
            });
        }).catch((err) => {
            ErrorAlert(err);
        })
    }

    const onAttributeChange = (event, a) => {
        setAttribute(a);
        getAttributeTypes(a.value);
        setAttrVal("");
    };

    const onAttributeTextFieldChange = (event) => {
        event.preventDefault()
        setAttrVal(event.target.value);
    }

    const onAttributeTypeChange = (event, a) => {
        setAttrVal({value: a.value, label: a.label})
    };

    const onDateChange = (date) => {
        setDate(date);
    };

    const onStockChange = (event, s) => {
        setSelectedStock(s);
    };


    return (
        <Grid container spacing={2}>

            <ProductOptions
              attribute={attribute}
              attributes={attributes}
              attributeTypes={attributeTypes}
              attrval={attrval}
              date={date}
              dateAttrval={dateAttrval}
              handleSearch={handleSearch}
              setDateAttrval={setDateAttrval}
              selectedStock={selectedStock}
              stockList={stockList}
              onAttributeChange={onAttributeChange}
              onAttributeTextFieldChange={onAttributeTextFieldChange}
              onAttributeTypeChange={onAttributeTypeChange}
              onDateChange={onDateChange}
              onStockChange={onStockChange}
            />

            {/* {!isLoading && (
                <Grid item xs={12}>
                <SkeletonTable />
                </Grid>
            )} */}

            { isLoading  && productsperiod.length > 0 && (
                <Fragment>
                    <Grid item xs={12}>
                        <ProductTable
                        //activePage={activePage}
                        classes={classes}
                        productsperiod={productsperiod}
                        //itemsPerPage={itemsPerPage}
                        //isPaginationLoading={isPaginationLoading}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <button
                        className="btn btn-sm btn-outline-success"
                        //disabled={isExcelLoading}
                        onClick={postProductsPeriodExcel}
                        >
                        Выгрузить в excel
                        </button>
                    </Grid>
                </Fragment>
            )}
            
            
        </Grid>
    )
}