import React, { useState, useEffect } from "react";
import Axios from "axios";
import Select from "react-select";
import Moment from "moment";
import Searching from "../../../Searching";
import Alert from "react-s-alert";
import HistoryDetails from "./HistoryDetails";
import TableContents from "./TableContents";

export default function ReportInvoiceHistory({ companyProps, parameters }) {
  const [consignator, setConsignator] = useState(
    parameters && parameters.isCounterparties
      ? { label: parameters.customer, value: parameters.id }
      : { label: "Все", value: 0 }
  );
  const [consignators, setConsignators] = useState([]);
  const [dateFrom, setDateFrom] = useState(
    parameters
      ? Moment(parameters.date).format("YYYY-MM-DD")
      : Moment().format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [details, setDetails] = useState([]);
  const [invoicetype, setInvoicetype] = useState(
    parameters && parameters.type === 1
      ? {
          value: "17",
          label: "Возврат с консигнации",
        }
      : parameters
      ? {
          value: "16",
          label: "Передача на консигнацию",
        }
      : ""
  );
  const [invoicetypes, setInvoicetypes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [markedInvoice, setMarkedInvoice] = useState(null);
  const [counterparty, setCounterparty] = useState({ label: "Все", value: 0 });
  const [counterparties, setCounterparties] = useState([]);
  const [paramState, setParamState] = useState(parameters);
  const [stockFrom, setStockFrom] = useState([{ label: "Все", value: 0 }]);
  const [stockList, setStockList] = useState([]);
  const [stockTo, setStockTo] = useState([{ label: "Все", value: 0 }]);

  const company = companyProps ? companyProps.value : "";

  useEffect(() => {
    getInvoiceTypes();

    if (!company) {
      getStockList();
    }
  }, []);

  //Данный эффект вызывается только при выполнении перехода из консгинационного отчёта по товарам.
  //Нужен чтобы автоматически заполнить все поля и отправить запрос.
  useEffect(() => {
    if (paramState) {
      getJurBuyers(paramState.customer);
    }
    if (paramState && !paramState.isCounterparties) {
      invoiceDetails({
        invoicedate: paramState.date,
        invoicenumber: paramState.invoice,
        invoicetypeid: "16",
      });
    }
  }, [paramState]);

  useEffect(() => {
    if (invoicetype.value && details.length === 0) {
      searchInvoices();
    }
    setInvoices([]);
    setDetails([]);
  }, [company]);

  useEffect(() => {
    if (!isDateChanging && invoicetype.value) {
      searchInvoices();
      setParamState("");
    }

    return () => {
      setDateChanging(false);
    };
  }, [invoicetype, dateFrom, dateTo]);

  const getInvoiceTypes = () => {
    Axios.get("/api/invoice/types", {
      params: { invoicetypes: ["1", "2", "7", "0", "16", "17"] },
    })
      .then((res) => res.data)
      .then((list) => {
        const invoicetypesList = list.map((type) => {
          return {
            value: type.id,
            label: type.name,
          };
        });
        setInvoicetypes(invoicetypesList);
      });
  };

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e.target.value);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e.target.value);
  };

  const handleInvoiceTypeChange = (inv) => {
    setInvoicetype(inv);
    !paramState && setDetails([]);
    setConsignator({ label: "Все", value: 0 });
    setCounterparty({ label: "Все", value: 0 });
    if (inv.value === "2") {
      getCounterparties();
    }
    if (inv.value === "16" || inv.value === "17") {
      getJurBuyers();
    }
  };

  const handleStockFromChange = (s) => {
    setStockFrom(s);
  };

  const handleStockToChange = (s) => {
    setStockTo(s);
  };

  const handleCounterpartyChange = (p) => {
    setCounterparty(p);
  };

  const handleConsignatorChange = (c) => {
    setConsignator(c);
  };

  const changeDate = (dateStr) => {
    let dF, dT;
    if (dateStr === "today") {
      dF = Moment().format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    } else if (dateStr === "month") {
      dF = Moment().startOf("month").format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    }
    setDateFrom(dF);
    setDateTo(dT);
  };

  const handleSearch = () => {
    searchInvoices();
  };

  const searchInvoices = () => {
    if (!invoicetype.value) {
      return Alert.warning("Выберите тип накладной", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    setLoading(true);
    Axios.get("/api/report/history/invoices", {
      params: {
        company,
        dateFrom,
        dateTo,
        invoicetype: invoicetype.value,
        stockFrom: stockFrom.value,
        stockTo: stockTo.value,
        counterpartie: counterparty.value,
        consignator: consignator.value,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setInvoices(res);

        !paramState && setDetails([]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setDetails([]);
        setLoading(false);
      });
  };

  const getJurBuyers = (customer) => {
    Axios.get("/api/buyers", { params: { company } })
      .then((res) => res.data)
      .then((res) => {
        const all = [{ label: "Все", value: "0" }];
        const options = res.map((stock) => {
          return {
            value: stock.id,
            label: stock.name,
          };
        });
        if (customer) {
          options.forEach((e) => {
            if (e.label === customer) {
              setConsignator({ value: e.value, label: e.label });
            }
          });
        }
        setConsignators([...all, ...options]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCounterparties = () => {
    Axios.get("/api/counterparties/search", {
      params: { company },
    })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "0" }];
        const counterpartiesList = list.map((result) => {
          return {
            label: result.name,
            value: result.id,
          };
        });
        setCounterparties([...all, ...counterpartiesList]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStockList = () => {
    Axios.get("/api/stock", { params: { company } })
      .then((res) => res.data)
      .then((res) => {
        const options = res.map((stock) => {
          return {
            value: stock.id,
            label: stock.name,
          };
        });

        const allStock = [{ value: "0", label: "Все" }];
        setStockList([...allStock, ...options]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const invoiceDetails = (inv) => {
    setMarkedInvoice(inv);
    Axios.get("/api/report/history/invoice/details", {
      params: {
        company,
        invoicetype: inv.invoicetypeid,
        invoicenumber: inv.invoicenumber,
      },
    })
      .then((res) => res.data)
      .then((detailsList) => {
        if (detailsList.length === 0) {
          return Alert.info("Товаров в данной накладной нет", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        }
        const copyDetails = detailsList.slice();
        const detailNull = copyDetails.shift();
        if (detailNull.units === null) {
          return Alert.info("Детали по данной накладной отсутствуют", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        }
        setDetails(detailsList);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const backToList = () => {
    setDetails([]);
    setMarkedInvoice(null);
    if (paramState) {
      searchInvoices();
    }
  };

  return (
    <div className="report-history-invoice">
      <div className="row">
        <div className="col-md-2 today-btn">
          <button
            className="btn btn-block btn-outline-success mt-30"
            onClick={() => changeDate("today")}
          >
            Сегодня
          </button>
        </div>
        <div className="col-md-2 month-btn">
          <button
            className="btn btn-block btn-outline-success mt-30"
            onClick={() => changeDate("month")}
          >
            Текущий месяц
          </button>
        </div>
        <div className="col-md-2 date-block">
          <label htmlFor="">Дата с</label>
          <input
            type="date"
            value={dateFrom}
            className="form-control"
            name="datefrom"
            onChange={dateFromChange}
          />
        </div>
        <div className="col-md-2 date-block">
          <label htmlFor="">Дата по</label>
          <input
            type="date"
            value={dateTo}
            className="form-control"
            name="dateto"
            onChange={dateToChange}
          />
        </div>
        <div className="col-md-3 point-block">
          <label htmlFor="">Выберите тип накладной</label>
          <Select
            name="stock"
            value={invoicetype}
            noOptionsMessage={() => "Выберите значение из списка"}
            onChange={handleInvoiceTypeChange}
            placeholder="Выберите тип накладной"
            options={invoicetypes || []}
          />
        </div>
        {(invoicetype.value === "1" || invoicetype.value === "7") && (
          <div className="col-md-3 point-block">
            <label htmlFor="">Со склада</label>
            <Select
              name="stockFrom"
              value={stockFrom}
              onChange={handleStockFromChange}
              options={stockList}
              placeholder="Выберите склад"
              noOptionsMessage={() => "Склад не найден"}
            />
          </div>
        )}
        {(invoicetype.value === "1" || invoicetype.value === "2") && (
          <div className="col-md-3 point-block">
            <label htmlFor="">На склад</label>
            <Select
              name="stockTo"
              value={stockTo}
              onChange={handleStockToChange}
              options={stockList}
              placeholder="Выберите склад"
              noOptionsMessage={() => "Склад не найден"}
            />
          </div>
        )}
        {invoicetype.value === "2" && (
          <div className="col-md-3 point-block">
            <label htmlFor="">Поставщики</label>
            <Select
              name="counterparty"
              value={counterparty}
              onChange={handleCounterpartyChange}
              options={counterparties}
              placeholder="Выберите контрагента"
              noOptionsMessage={() => "Контрагент не найден"}
            />
          </div>
        )}
        {(invoicetype.value === "16" || invoicetype.value === "17") && (
          <div className="col-md-3 point-block">
            <label htmlFor="">Консигнаторы</label>
            <Select
              name="consignator"
              value={consignator}
              onChange={handleConsignatorChange}
              options={consignators}
              placeholder="Выберите консигнатора"
              noOptionsMessage={() => "Консигнатор не найден"}
            />
          </div>
        )}

        <div className="col-md-1 text-right search-btn">
          <button className="btn btn-success mt-30" onClick={handleSearch}>
            Поиск
          </button>
        </div>
      </div>
      {isLoading && <Searching />}
      {!isLoading &&
        invoices.length === 0 &&
        (!paramState || paramState.isCounterparties) && (
          <div className="row mt-10 text-center">
            <div className="col-md-12 not-found-text">Накладные не найдены</div>
          </div>
        )}
      {!isLoading && invoices.length > 0 && details.length === 0 && (
        <TableContents
          invoices={invoices}
          invoiceDetails={invoiceDetails}
          invoicetype={invoicetype}
        />
      )}
      {details.length > 0 && (
        <HistoryDetails
          markedInvoice={markedInvoice}
          backToList={backToList}
          details={details}
          invoicetype={invoicetype}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      )}
    </div>
  );
}
