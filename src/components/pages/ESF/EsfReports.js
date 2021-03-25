import React, { Component, Fragment } from "react";
// import Axios from 'axios';
// import PleaseWait from '../../PleaseWait';
import Alert from "react-s-alert";
// import Moment from 'moment';
import Select from "react-select";

// import { parseString } from 'xml2js';
import DefferedEsf from "./Reports/DefferedEsf";
import SendedEsf from "./Reports/SendedEsf";

class EsfReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportType: "",
      reportTypes: [
        { value: "deffered", label: "Отчет по отложенным счет-фактурам" },
        { value: "sended", label: "Отчет по отправленным счет-фактурам" },
      ],
    };
    this.sendedEsf = React.createRef();
    this.defferedEsf = React.createRef();
  }

  createSessionClick = (childType) => {
    this.setState({ childType });
    this.props.createSession("esfReports");
  };

  sessionCreated = () => {
    const { childType } = this.state;
    if (childType === "defferedEsf") {
      this.sendedEsf.current.reConfirmInvoiceById();
    } else {
      this.sendedEsf.current.reQueryInvoiceById();
    }
  };

  createSessionFailed = () => {
    Alert.warning("Возникла ошибка при обновлении статуса счет-фактур", {
      position: "top-right",
      effect: "bouncyflip",
      timeout: 3000,
    });
    this.setState({ isLoading: false });
  };

  reportTypeSelectChange = (reportType) => {
    this.setState({ reportType });
  };

  render() {
    const { reportType, reportTypes } = this.state;
    const { value } = reportType;
    return (
      <Fragment>
        <div className={`row ${reportType ? "pb-10" : ""}`}>
          <div className="col-md-6">
            <label htmlFor="">Выберите отчет</label>
            <Select
              name="reportType"
              value={reportType}
              noOptionsMessage={() => "Отчет не найден"}
              onChange={this.reportTypeSelectChange}
              placeholder="Выберите отчет"
              options={reportTypes}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            {value === "deffered" && (
              <DefferedEsf
                createSession={this.createSessionClick}
                ref={this.defferedEsf}
              />
            )}
            {value === "sended" && (
              <SendedEsf
                createSession={this.createSessionClick}
                ref={this.sendedEsf}
              />
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default EsfReports;
