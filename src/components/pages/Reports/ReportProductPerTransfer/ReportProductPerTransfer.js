import React, { useState, useEffect, Fragment} from 'react';
import Axios from "axios";
import ProductTable from "./ProductTable";
import ProductOptions from "./ProductOptions";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";

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

export default function ReportProductPerTransfer({ companyProps }) {

    const [date, setDate] = useState(new Date());
    const [attribute, setAttribute] = useState({
        value: "@",
        label: "Все",
        format: "",
    });
    const [attributes, setAttributes] = useState([]);
    const [sprvalue, setSprvalue] = useState({
        value: "@",
        label: "Все",
        format: "",
    });
    const [sprvalues, setSprvalues] = useState([]);
    
    const [selectedStock, setSelectedStock] = useState({
        value: "0",
        label: "Все",
      });
    const [stockList, setStockList] = useState([]);
    const [stockForTable, setStockForTable] = useState();

    const [productstransfer, setProductsTransfer] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const company = companyProps ? companyProps.value : "";

    useEffect(() => {
        if(!company) {
            getAttributes();
            //getProductsTransfer();
            getStockList();
        }
    }, [])

    useEffect(() => {
        if(company) {
            getAttributes();
            //getProductsTransfer();
            getStockList();
        }
    }, [company])

    const handleSearch = () => {
        // if (Moment(date).isBefore("2019-11-06")) {
        //   return Alert.warning(
        //     `Дата для запроса слишком старая. Исторические данные доступны, начиная с 25 ноября 2019 года`,
        //     {
        //       position: "top-right",
        //       effect: "bouncyflip",
        //       timeout: 3000,
        //     }
        //   );
        // } else if (!date) {
        //   return Alert.warning(`Заполните дату`, {
        //     position: "top-right",
        //     effect: "bouncyflip",
        //     timeout: 3000,
        //   });
        // }
    
        // if (!selectedStock) {
        //   return Alert.warning("Выберите склад", {
        //     position: "top-right",
        //     effect: "bouncyflip",
        //     timeout: 3000,
        //   });
        // }
        setProductsTransfer([]);
        getProductsTransfer();
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
            setSprvalues([...all, ...spr]);
        })
        .catch((err) => {
            ErrorAlert(err);
        });
    }

    const getProductsTransfer = () => {
        setLoading(false);
        Axios.get(`http://tezportal.ddns.net/api/report/movement/product`, { params: { 
            month: 1, // date.getMonth() + 1
            year: 2021, // date.getFullYear()
            point: 189, // selectedStock.value
            attribute: 1, // attribute.value
            value: 1 // sprvalue.value
        }})
        .then((res) => res.data)
        .then((productsList) => {
            setLoading(true);
            setProductsTransfer(productsList);
            setStockForTable(selectedStock)
        })
        .catch((err) => {
            ErrorAlert(err);
        })
    }

    const onDateChange = (date) => {
        setDate(date);
    };

    const onStockChange = (event, s) => {
        setSelectedStock(s);
    };

    const onAttributeChange = (event, a) => {
        setAttribute(a);
    };

    const onSprChange = (event, a) => {
        setSprvalue(a);
    }

    return (
        <Grid container spacing={2}>

            <ProductOptions 
              attribute={attribute}  
              attributes={attributes}
              date={date}
              sprvalue={sprvalue}
              sprvalues={sprvalues}
              selectedStock={selectedStock}
              stockList={stockList}
              handleSearch={handleSearch}
              onAttributeChange={onAttributeChange}
              onDateChange={onDateChange}
              onSprChange={onSprChange}
              onStockChange={onStockChange}
            />

            {!isLoading && (
                <Grid item xs={12}>
                <SkeletonTable />
                </Grid>
            )}

            { isLoading && (
                <Fragment>
                    <Grid item xs={12}>
                        <ProductTable
                        productstransfer={productstransfer}
                        stock={stockForTable}
                        />
                    </Grid>

                    {/* <Grid item xs={12}>
                        <button
                        className="btn btn-sm btn-outline-success"
                        //disabled={isExcelLoading}
                        onClick={getStockbalanceExcel}
                        >
                        Выгрузить в excel
                        </button>
                    </Grid> */}
                </Fragment>
            )}
            
            
        </Grid>
    )
}