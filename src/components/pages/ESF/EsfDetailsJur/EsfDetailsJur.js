import React, { Component } from "react";
import ReportD from "./ReportD";
import ReportE from "./ReportE";
import ESFproducts from "./ESFproducts";
import Moment from "moment";
import Axios from "axios";
import Alert from "react-s-alert";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export default class EsfDetailsJur extends Component {
  state = {
    esf: this.props.esf,
    // for D report ***********BEGIN***************************
    addressReceive: this.props.esf.сonsigneeaddress
      ? this.props.esf.сonsigneeaddress
      : "",
    addressSend: this.props.esf.сonsignoraddress
      ? this.props.esf.сonsignoraddress
      : "",
    countryCode: this.props.esf.countryCode ? this.props.esf.countryCode : "",
    TINreceiver: this.props.esf.сonsigneetin ? this.props.esf.сonsigneetin : "",
    TINshipper: this.props.esf.сonsignortin ? this.props.esf.сonsignortin : "",
    receiver: this.props.esf.сonsigneename ? this.props.esf.сonsigneename : "",
    shipper: this.props.esf.сonsignorname ? this.props.esf.сonsignorname : "",
    // for D report ***********END***************************
    // for E report ***********BEGIN***************************
    contract: this.props.esf.hasContract,
    contractDate: this.props.cDate
      ? this.props.cDate
      : Moment().format("YYYY-MM-DD"),
    contractNumber: this.props.esf.contractNum
      ? this.props.esf.contractNum
      : "",
    contractConditions: this.props.esf.term ? this.props.esf.term : "",
    destination: this.props.esf.destination ? this.props.esf.destination : "",
    powerOfAttorneyNumber: this.props.esf.warrant ? this.props.esf.warrant : "",
    powerOfAttorneyDate: this.props.poaDate
      ? this.props.poaDate
      : Moment().format("YYYY-MM-DD"),
    sendMethod: this.props.esf.transportTypeCode
      ? this.props.esf.transportTypeCode
      : "",
    sendMethods: [],
    supplyCondition: this.props.esf.deliveryConditionCode
      ? this.props.esf.deliveryConditionCode
      : "",
    supplyConditions: [],
    // for E report ***********END***************************
  };

  // for D report ***********BEGIN***************************
  onAddressReceiveChange = (e) => {
    const addressReceive = e.target.value;
    this.setState({ addressReceive });
  };

  onAddressSendChange = (e) => {
    const addressSend = e.target.value;
    this.setState({ addressSend });
  };

  onCountryCodeChange = (e) => {
    const countryCode = e.target.value.toUpperCase();
    this.setState({ countryCode });
  };

  onTINreceiverChange = (e) => {
    let TINreceiver = isNaN(e.target.value) ? 0 : e.target.value;
    if (TINreceiver.length > 12) {
      return Alert.warning("Длина ИИН не может превышать 12 символов", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    this.setState({ TINreceiver });
  };

  onTINshipperChange = (e) => {
    let TINshipper = isNaN(e.target.value) ? 0 : e.target.value;
    if (TINshipper.length > 12) {
      return Alert.warning("Длина ИИН не может превышать 12 символов", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    this.setState({ TINshipper });
  };

  onReceiverChange = (e) => {
    const receiver = e.target.value;
    this.setState({ receiver });
  };

  onShipperChange = (e) => {
    const shipper = e.target.value;
    this.setState({ shipper });
  };
  // for D report ***********END***************************

  componentDidMount() {
    this.getTransportType();
    this.getDeliveryCondition();
  }

  // for E report ***********BEGIN***************************
  getTransportType = () => {
    const { sendMethod } = this.state;
    const name = "transporttype";
    Axios.get("/api/esf/getspr", {
      params: { name },
    })
      .then((res) => res.data)
      .then((res) => {
        let newSendMethod = "";
        res.forEach((method) => {
          if (method.id === sendMethod && sendMethod) {
            newSendMethod = { label: method.name, value: method.id };
          }
        });

        const sendMethods = res.map((method) => {
          return {
            label: method.name,
            value: method.id,
          };
        });

        this.setState({
          sendMethods,
          sendMethod: newSendMethod,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getDeliveryCondition = () => {
    const { supplyCondition } = this.state;
    const name = "deliverycondition";
    Axios.get("/api/esf/getspr", {
      params: { name },
    })
      .then((res) => res.data)
      .then((res) => {
        let newDeliveryCondition = "";
        res.forEach((condition) => {
          if (condition.id === supplyCondition && supplyCondition) {
            newDeliveryCondition = {
              label: condition.name,
              value: condition.id,
            };
          }
        });

        const supplyConditions = res.map((condition) => {
          return {
            label: condition.name,
            value: condition.id,
          };
        });
        this.setState({
          supplyConditions,
          supplyCondition: newDeliveryCondition,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleSwitch = (name, checked) => {
    this.setState({ contract: checked });
  };

  onContractDateChange = (e) => {
    const contractDate = e.target.value;
    this.setState({ contractDate });
  };

  onContractNumberChange = (e) => {
    const contractNumber = e.target.value;
    this.setState({ contractNumber });
  };

  onContractConditionsChange = (e) => {
    const contractConditions = e.target.value;
    this.setState({ contractConditions });
  };

  onDestinationChange = (e) => {
    const destination = e.target.value;
    this.setState({ destination });
  };

  onPowerOfAttorneyNumberChange = (e) => {
    const powerOfAttorneyNumber = e.target.value;
    this.setState({ powerOfAttorneyNumber });
  };

  onPowerOfAttorneyDateChange = (e) => {
    const powerOfAttorneyDate = e.target.value;
    this.setState({ powerOfAttorneyDate });
  };

  onSendMethodChange = (sendMethod) => {
    this.setState({ sendMethod });
  };

  onSupplyConditionChange = (supplyCondition) => {
    this.setState({ supplyCondition });
  };

  // for E report ***********END***************************

  //for E and D post into database ***********BEGIN***************************
  esfManagement = () => {
    const {
      esf,
      addressReceive,
      addressSend,
      //countryCode,
      TINreceiver,
      TINshipper,
      receiver,
      shipper,
      //for D report END
      //for E report BEGIN
      contract,
      contractDate,
      contractNumber,
      contractConditions,
      destination,
      powerOfAttorneyNumber,
      powerOfAttorneyDate,
      sendMethod,
      supplyCondition,
      //for E report END
    } = this.state;

    if (contract && !contractNumber) {
      return Alert.warning("Номер контракта должен быть заполнен!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    const info = {
      hasсontract: contract,
      contractnum: contract ? contractNumber : "",
      contractdate: contract ? Moment(contractDate).format("DD.MM.YYYY") : "",
      term: contractConditions,
      transporttypecode: sendMethod.value,
      warrant: powerOfAttorneyNumber,
      warrantdate: Moment(powerOfAttorneyDate).format("DD.MM.YYYY"),
      destination: destination,
      deliveryconditioncode: supplyCondition.value,
      сonsignortin: TINshipper,
      сonsignorname: shipper,
      сonsignoraddress: addressSend,
      сonsigneetin: TINreceiver,
      сonsigneename: receiver,
      сonsigneeaddress: addressReceive,
      esfid: esf.num,
    };
    Axios.post("/api/esf/management", info)
      .then((res) => res.data)
      .then((result) => {
        Alert.success("Изменения успешно сохранены", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
        this.props.getFormationJurEsf();
      })
      .catch((err) => {
        Alert.error("Возникла ошибка при обработке запроса", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });

        console.log(err);
      });
  };
  //for E and D post into database ***********END***************************

  closeEsf = () => {
    this.props.closeDetail();
  };

  render() {
    const {
      //for D report BEGIN
      addressReceive,
      addressSend,
      countryCode,
      TINreceiver,
      TINshipper,
      receiver,
      shipper,
      //for D report END
      //for E report BEGIN
      contract,
      contractDate,
      contractNumber,
      contractConditions,
      destination,
      powerOfAttorneyNumber,
      powerOfAttorneyDate,
      sendMethod,
      sendMethods,
      supplyCondition,
      supplyConditions,
      //for E report END
      esf,
    } = this.state;
    return (
      <Tabs>
        <TabList>
          <Tab>Раздел D. Реквизиты грузоотправителя и грузополучателя</Tab>
          <Tab>Раздел E. Договор (контракт)</Tab>
          <Tab>Товары</Tab>
        </TabList>

        <TabPanel>
          <ReportD
            addressReceive={addressReceive}
            addressSend={addressSend}
            countryCode={countryCode}
            TINreceiver={TINreceiver}
            TINshipper={TINshipper}
            receiver={receiver}
            shipper={shipper}
            onAddressReceiveChange={this.onAddressReceiveChange}
            onAddressSendChange={this.onAddressSendChange}
            onCountryCodeChange={this.onCountryCodeChange}
            onTINreceiverChange={this.onTINreceiverChange}
            onTINshipperChange={this.onTINshipperChange}
            onReceiverChange={this.onReceiverChange}
            onShipperChange={this.onShipperChange}
            esfManagement={this.esfManagement}
            closeEsf={this.closeEsf}
            esf={esf}
          />
        </TabPanel>
        <TabPanel>
          <ReportE
            contract={contract}
            contractDate={contractDate}
            contractNumber={contractNumber}
            contractConditions={contractConditions}
            destination={destination}
            powerOfAttorneyNumber={powerOfAttorneyNumber}
            powerOfAttorneyDate={powerOfAttorneyDate}
            sendMethod={sendMethod}
            sendMethods={sendMethods}
            supplyCondition={supplyCondition}
            supplyConditions={supplyConditions}
            handleSwitch={this.handleSwitch}
            onContractDateChange={this.onContractDateChange}
            onContractNumberChange={this.onContractNumberChange}
            onContractConditionsChange={this.onContractConditionsChange}
            onDestinationChange={this.onDestinationChange}
            onPowerOfAttorneyNumberChange={this.onPowerOfAttorneyNumberChange}
            onPowerOfAttorneyDateChange={this.onPowerOfAttorneyDateChange}
            onSendMethodChange={this.onSendMethodChange}
            onSupplyConditionChange={this.onSupplyConditionChange}
            esfManagement={this.esfManagement}
            esf={esf}
            closeEsf={this.closeEsf}
          />
        </TabPanel>
        <TabPanel>
          <ESFproducts esf={esf} closeEsf={this.closeEsf} />
        </TabPanel>
      </Tabs>
    );
  }
}
