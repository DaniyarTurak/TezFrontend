import React, { Component, Fragment } from 'react';
import Axios from 'axios';
import Moment from 'moment';
import Alert from 'react-s-alert';
import Select from 'react-select';
import PleaseWait from '../../PleaseWait';
import SweetAlert from 'react-bootstrap-sweetalert';

import { parseString } from 'xml2js';

class InboundInvoice extends Component {
	state = {
		dateFrom: Moment().format('YYYY-MM-DD'),
		dateTo: Moment().format('YYYY-MM-DD'),
		inboundInvoices: [],
		productOptions: [],
		isLoading: false,
		isQueryInvoice: false,
		isSubmit: false,
		reviseProducts: [],
		selectedInvoice: '',
		inboundInvoiceDetails: [],
		selectedInternalInvoice: '',
		internalInvoices: [],
		isLoading2: false,
		invoiceSubtypes: {
			'ORDINARY_INVOICE': 'Основной ЭСФ',
			'FIXED_INVOICE': 'Исправленный ЭСФ',
			'ADDITIONAL_INVOICE': 'Дополнительный ЭСФ'
		},
		sweetalert: null
	};

	componentDidMount() {
		this.getProducts();
		this.getInboundInvoices();
	};

	getProducts = (inputValue) => {
		Axios.get('/api/products', { params: { productName: inputValue } }).then(res => res.data)
			.then(list => {
				const productOptions = list.map(product => {
					return ({
						label: product.name,
						value: product.id,
						code: product.code
					})
				});
				this.setState({ productOptions });
			}).catch(err => {
				console.log(err);
			});
	};

	getInternalInvoices = (dateInvoice, seller) => {
		Axios.get('/api/esf/internalInvoices', { params: { dateInvoice, seller } }).then(res => res.data)
			.then(results => {
				console.log(results)
				const internalInvoices = results.map(result => {
					return {
						label: `Накладная ${result.altnumber} от ${Moment(result.invoicedate).format('DD.MM.YYYY')}`,
						value: result.invoicenumber
					}
				})
				this.setState({ internalInvoices });
			}).catch(err => {
				console.log(err);
			});
	};

	getInboundInvoices = () => {
		Axios.get('/api/esf/getInboundInvoices', { params: { revise: false } }).then(res => res.data)
			.then((results) => {
				const { invoiceSubtypes } = this.state;
				const inboundInvoices = results.map(result => {
					return {
						label: `${invoiceSubtypes[result.subtype]} ${result.esfregnum} от ${Moment(result.esfdate).format('DD.MM.YYYY')} (${result.sellerName})`,
						value: result.id,
						id: result.esfid,
						details: result
					}
				})
				this.setState({ inboundInvoices, isLoading: false, selectedInvoice: '', inboundInvoiceDetails: [] })
			}).catch((err) => {
				console.log(err)
			});
	};

	getInboundInvoiceDetails = (invoice) => {
		const req = { esfid: invoice.value };

		Axios.post('/api/esf/getInboundInvoiceDetails', req).then(res => res.data)
			// Axios.get('/api/esf/getInboundInvoiceDetails', { params: { id: 1523 } }).then(res => res.data)
			.then((result) => {
				const { selectedInvoice } = this.state;
				const inboundInvoiceDetails = result.text;
				console.log(inboundInvoiceDetails)
				inboundInvoiceDetails.forEach(detail => {
					if (detail.stock && detail.declaration) this.matchProducts(detail.stock, detail);
				});

				selectedInvoice.invoices = result.invoices;

				let dt = invoice.details.deliverydocnum || Moment().format();
				this.getInternalInvoices(Moment(dt).format('YYYY-MM-DD'), invoice.details.seller);

				this.setState({
					inboundInvoiceDetails,
					isLoading: false,
					selectedInvoice,
					dateInvoice: (invoice.detail && Moment(invoice.detail.deliverydocdate).format('YYYY-MM-DD')) || Moment().format('YYYY-MM-DD')
				});
			}).catch((err) => {
				console.log(err);
			});
	};

	getInboundInvoiceDetails2 = () => {
		const { selectedInternalInvoice, selectedInvoice } = this.state;
		const { value } = selectedInvoice;
		const invoices = selectedInternalInvoice.map(invoice => {
			return { id: invoice.value }
		});
		const req = { esfid: value, invoices };

		Axios.post('/api/esf/getInboundInvoiceDetails2', req).then(res => res.data)
			.then((result) => {
				// inboundInvoiceDetails.forEach(detail => {
				// 	if (detail.name) this.matchProducts(detail.stock, detail);
				// });

				// this.setState({
				// 	inboundInvoiceDetails,
				// 	isLoading2: false,
				// });

				const { selectedInvoice } = this.state;
				const inboundInvoiceDetails = result.text;
				console.log(inboundInvoiceDetails);
				inboundInvoiceDetails.forEach(detail => {
					if (detail.stock && detail.declaration) this.matchProducts(detail.stock, detail);
				});

				selectedInvoice.invoices = result.invoices;

				this.setState({
					inboundInvoiceDetails,
					isLoading2: false,
					selectedInvoice
				});
			}).catch((err) => {
				console.log(err);
			});
	};

	dateFromChange = (e) => {
		const dateFrom = e.target.value;
		this.setState({ dateFrom });
	};

	dateToChange = (e) => {
		const dateTo = e.target.value;
		this.setState({ dateTo });
	};

	dateInvoiceChange = (e) => {
		const dateInvoice = e.target.value;
		const { selectedInvoice } = this.state;
		this.setState({ dateInvoice });
		this.getInternalInvoices(dateInvoice, selectedInvoice.details.seller);
	};

	productListChange = (stockProduct, esfProduct) => {
		this.matchProducts(stockProduct.value, esfProduct)
	};

	matchProducts = (stockProduct, esfProduct) => {
		let { reviseProducts } = this.state;
		const newProduct = { stockProduct, esfProduct };

		reviseProducts = reviseProducts.filter(product => {
			return product.esfProduct !== esfProduct
		});

		console.log(newProduct);
		reviseProducts.push(newProduct);
		console.log(reviseProducts);
		this.setState({ reviseProducts });
	};

	onProductListInput = (productName) => {
		if (productName.length > 0) this.getProducts(productName)
	};

	invoiceSelectChange = (selectedInvoice) => {
		console.log(selectedInvoice)
		if (Object.keys(selectedInvoice).length > 0) {
			this.setState({ selectedInvoice, isLoading: true, reviseProducts: [] })
			this.getInboundInvoiceDetails(selectedInvoice);
		} else {
			this.setState({ selectedInvoice });
		}
	};

	internalInvoiceSelectChange = (selectedInternalInvoice) => {
		console.log(selectedInternalInvoice)
		this.setState({ selectedInternalInvoice })
	};

	onQueryInvoice = () => {
		const { dateFrom, dateTo } = this.state;
		if (!dateFrom || !dateTo) {
			Alert.warning('Выберите период', {
				position: 'top-right',
				effect: 'bouncyflip',
				timeout: 3000
			});
		};

		const sessionId = localStorage.getItem('isme-session');
		const tdateFrom = Moment(dateFrom).format();
		const tdateTo = Moment(dateTo).format();
		const pageNum = 0;

		this.setState({ isQueryInvoice: true, selectedInvoice: '', inboundInvoiceDetails: [] });
		this.queryInvoice(sessionId, tdateFrom, tdateTo, pageNum);
	};

	queryInvoice = (sessionId, dateFrom, dateTo, pageNum) => {
		Axios.get('/api/esf/queryInvoice', {
			params: {
				sessionId, dateFrom, dateTo, pageNum
			}
		}).then(res => res.data).then((inbound) => {
			parseString(inbound, (err, result) => {
				console.log(result);
				try {
					const queryInvoiceResponse = result['soap:Envelope']['soap:Body'][0]['esf:queryInvoiceResponse'][0];
					const invoiceInfoList = queryInvoiceResponse['invoiceInfoList'][0]['invoiceInfo'];
					const rsCount = queryInvoiceResponse['rsCount'][0];
					console.log(invoiceInfoList);

					if (rsCount > 0) {
						let failedCount = 0;
						invoiceInfoList.forEach(invoiceInfo => {
							const status = invoiceInfo['invoiceStatus'];
							if (status) failedCount += status[0] === 'FAILED' ? 1 : 0
						});

						const esflist = invoiceInfoList.map(invoice => {
							const invoiceId = invoice['invoiceId'] ? invoice['invoiceId'][0] : null
							const invoiceStatus = invoice['invoiceStatus'] ? invoice['invoiceStatus'][0] : null
							const registrationNumber = invoice['registrationNumber'] ? invoice['registrationNumber'][0] : null
							const invoiceBody = invoice['invoiceBody'] ? invoice['invoiceBody'][0] : null
							//console.log(invoiceId, invoiceStatus, registrationNumber, invoiceBody);
							return { invoiceId, registrationNumber, invoiceStatus, invoiceBody }
						});
						// console.log(esflist)
						this.esfInboundAcceptance(esflist, (rsCount - failedCount));
					} else {
						Alert.info('Входящие счет-фактуры отсутсвуют', {
							position: 'top-right',
							effect: 'bouncyflip',
							timeout: 3000
						});
						this.setState({ isQueryInvoice: false });
					}
				} catch (e) {
					try {
						const faultstring = result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0]['faultstring'][0];
						console.log(faultstring)
						const matchingWord = 'No open session associated with user.';
						if (faultstring.includes(matchingWord)) {
							this.props.createSession('inboundInvoice');
						}
					} catch (e) {
						Alert.warning('Возникла ошибка при поиске входящих счет-фактур', {
							position: 'top-right',
							effect: 'bouncyflip',
							timeout: 3000
						});

						this.setState({ isQueryInvoice: false });
					}
				}
			});
		}).catch((err) => {
			console.log(err)
		});
	};

	createSessionFailed = (type) => {
		if (type === 'confirmInvoiceById') {
			this.sweetAlert();
			console.log(this.state)
		} else {
			Alert.warning('Возникла ошибка при поиске входящих счет-фактур', {
				position: 'top-right',
				effect: 'bouncyflip',
				timeout: 3000
			});
			this.setState({ isQueryInvoice: false });
		};
	};

	esfInboundAcceptance = (esflist, rsCount) => {
		this.setState({ isLoading: false });
		let i, j, temparray, chunk = 5;
		let options = [];

		for (i = 0, j = esflist.length; i < j; i += chunk) {
			temparray = esflist.slice(i, i + chunk);
			console.log(temparray)
			options.push({
				url: '/api/esf/esfInboundAcceptance',
				method: 'post',
				data: temparray
			});
		}

		Axios.all(options.map(option => {
			return Axios.request(option)
		})).then(res => {
			let results = res.map(r => r.data);
			console.log(results);
			this.setState({ isQueryInvoice: false });
			Alert.success(`Принято счет-фактур: ${rsCount}`, {
				position: 'top-right',
				effect: 'bouncyflip',
				timeout: 3000
			});
			this.getInboundInvoices();
		}).catch(err => {
			let errors = err.map(r => r.data);
			console.log(errors);
			Alert.warning('Возникла ошибка при поиске входящих счет-фактур', {
				position: 'top-right',
				effect: 'bouncyflip',
				timeout: 3000
			});
			this.setState({ isQueryInvoice: false });
		});

		// Axios.post('/api/esf/esfInboundAcceptance', esflist).then(res => res.data)
		// 	.then(() => {
		// 		this.setState({ isQueryInvoice: false });
		// 		Alert.success(`Принято счет-фактур: ${rsCount}`, {
		// 			position: 'top-right',
		// 			effect: 'bouncyflip',
		// 			timeout: 3000
		// 		});
		// 		this.getInboundInvoices();
		// 	}).catch((err) => {
		// 		console.log(err);
		// 		Alert.warning('Возникла ошибка при поиске входящих счет-фактур', {
		// 			position: 'top-right',
		// 			effect: 'bouncyflip',
		// 			timeout: 3000
		// 		});
		// 		this.setState({ isQueryInvoice: false });
		// 	});
	};

	onEsfRevising = () => {
		this.setState({ isSubmit: true });
		this.esfRevising(1);
	};

	onEsfRevisingSkip = () => {
		this.setState({ isSubmit: true });
		this.esfRevising(2);
	};

	esfRevising = (type) => {
		const { selectedInvoice, reviseProducts, inboundInvoiceDetails } = this.state;
		const esfid = selectedInvoice.value;
		const id = selectedInvoice.id;
		const sessionId = localStorage.getItem('isme-session');
		const passwords = JSON.parse(sessionStorage.getItem('isme-passwords'));

		const revising = reviseProducts.map(product => {
			return {
				id: product.stockProduct,
				declaration: product.esfProduct.declaration,
				description: product.esfProduct.description,
				origincode: product.esfProduct.truorigincode,
				pos: product.esfProduct.numberindeclaration,
				units: product.esfProduct.quantity,
				unitcode: product.esfProduct.unitcode
			}
		});

		const count = inboundInvoiceDetails.filter((product) => product.declaration).length;
		console.log(count)
		console.log(reviseProducts.length)
		if ((count !== reviseProducts.length)&&type===1) {
			this.setState({ isSubmit: false });
			Alert.warning('Заполните все необходимые поля', {
				position: 'top-right',
				effect: 'bouncyflip',
				timeout: 3000
			});
			return;
		};

		if (!passwords || passwords.length === 0) {
			this.setState({ isSubmit: false });
			return Alert.warning('Пожалуйста введите пароли!', {
				position: 'top-right',
				effect: 'bouncyflip',
				timeout: 3000
			});
		};

		const req = { esfid, revising };

		Axios.post('/api/esf/esfRevising', req).then(res => res.data)
			.then((revising) => {
				this.setState({ revising });
				this.confirmInvoiceById(sessionId, id, esfid);
			}).catch((err) => {
				this.setState({ isSubmit: false });
				Alert.warning(err.response.data.text || 'Возникла ошибка при сверке счет-фактур', {
					position: 'top-right',
					effect: 'bouncyflip',
					timeout: 15000
				});
				console.log(err);
			});
	};

	reConfirmInvoiceById = () => {
		const { selectedInvoice } = this.state;
		const id = selectedInvoice.id;
		const esfid = selectedInvoice.value;
		const sessionId = localStorage.getItem('isme-session');
		this.confirmInvoiceById(sessionId, id, esfid);
		this.setState({ sweetalert: null });
	};

	confirmInvoiceById = (sessionId, id, num) => {
		console.log(sessionId, id);
		Axios.get('/api/esf/confirmInvoiceById', {
			params: {
				sessionId, ids: [id]
			}
		}).then(res => res.data).then((confirm) => {
			parseString(confirm, (err, result) => {
				try {
					console.log(result);
					const confirmInvoiceById = result['soap:Envelope']['soap:Body'][0]['esf:confirmInvoiceByIdResponse'][0];
					const invoiceSummaryList = confirmInvoiceById['invoiceSummaryList'][0];
					console.log(invoiceSummaryList);
					this.getInboundInvoices();
					this.esfUpdateStatus(num, 'DELIVERED');
					this.setState({ isSubmit: false, selectedInvoice: '', inboundInvoiceDetails: [] });

					Alert.success('Успешно сохранено', {
						position: 'top-right',
						effect: 'bouncyflip',
						timeout: 3000
					});
				} catch (e) {
					try {
						const faultstring = result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0]['faultstring'][0];
						console.log(faultstring);
						const matchingWord = 'No open session associated with user.';
						if (faultstring.includes(matchingWord)) {
							this.props.createSession('confirmInvoiceById');
						}
					} catch (e) {
						console.log(e)
						this.sweetAlert();
						// Alert.warning('Возникла ошибка при сверке счет-фактур', {
						// 	position: 'top-right',
						// 	effect: 'bouncyflip',
						// 	timeout: 3000
						// });
					}
				}
			});
		}).catch((err) => {
			console.log(err);
		});
	};

	sweetAlert = () => {
		this.setState({
			sweetalert: <SweetAlert
				warning
				showCancel
				confirmBtnText="Повторить"
				cancelBtnText="Отложить"
				confirmBtnBsStyle="success"
				cancelBtnBsStyle="default"
				title="Счет-фактура успешно прошел сверку, но статус в ИС ЭСФ не обновился"
				onConfirm={() => this.reConfirmInvoiceById()}
				onCancel={() => this.hideAlert()}
			>
				Повторить попытку?
			</SweetAlert>
		});
	};

	hideAlert = () => {
		this.getInboundInvoices();
		this.setState({ sweetalert: null, isSubmit: false, selectedInvoice: '', inboundInvoiceDetails: [] });
	};

	esfUpdateStatus = (esfnum, status) => {
		const statuses = [{ esfnum, status }];
		Axios.post('/api/esf/esfUpdateStatus', { statuses }).then(res => res.data).then((result) => {
			console.log(result);
		}).catch((err) => {
			console.log(err);
		});
	};

	onInternalInvoiceBtn = () => {
		this.setState({ isLoading2: true, reviseProducts: [] });
		this.getInboundInvoiceDetails2();
	};

	openInvoiceDetails = () => {
		const { invoices } = this.state.selectedInvoice;
		const { selectedInternalInvoice } = this.state;
		let invoicenumbers = '';

		const invoicenumbers1 = invoices.map(invoice => {
			return {
				invoicenumber: invoice.id
			}
		});

		if (selectedInternalInvoice) {
			const invoicenumbers2 = selectedInternalInvoice.map(invoice => {
				return {
					invoicenumber: invoice.value
				}
			});

			invoicenumbers = [...invoicenumbers1, ...invoicenumbers2];
		} else {
			invoicenumbers = [...invoicenumbers1];
		}

		Axios.get('/api/esf/invoice/details', {
			params: { invoicenumbers }
			// params: { invoicenumber: 7306 }
		}).then(res => res.data)
			.then((details) => {
				console.log(details)
				if (details.length === 0) {
					Alert.info('Товаров в данной накладной нет', {
						position: 'top-right',
						effect: 'bouncyflip',
						timeout: 3000
					});
				} else {
					sessionStorage.setItem('isme-esf-invoice-details', JSON.stringify(details));
					window.open('/esf/invoiceDetails', '_blank')
				}
				this.setState({ details })
			}).catch((err) => {
				console.log(err);
			})
	};

	render() {
		const { dateFrom, dateTo, inboundInvoices, selectedInvoice,
			selectedInternalInvoice, internalInvoices, dateInvoice,
			productOptions, inboundInvoiceDetails, isLoading, isLoading2,
			isQueryInvoice, sweetalert, isSubmit } = this.state;
		return (
			<Fragment>
				<div className="empty-space"></div>

				{sweetalert}

				<div className="row pt-10">
					<div className="col-md-12">
						<h6>Прием счет-фактур</h6>
					</div>
				</div>

				<div className="row">
					<div className="col-md-3">
						<input type="date" value={dateFrom} className="form-control" onChange={this.dateFromChange}></input>
					</div>
					<div className="col-md-3">
						<input type="date" value={dateTo} className="form-control" onChange={this.dateToChange}></input>
					</div>
					<div className="col-md-6 text-right">
						<button className="btn btn-outline-info" onClick={this.onQueryInvoice} disabled={isQueryInvoice}>
							{isQueryInvoice ? 'Идет поиск счет-фактур' : 'Поиск'}
						</button>
					</div>
				</div>

				<div className={`row inbound-invoice ${Object.keys(selectedInvoice).length > 0 ? 'pb-10' : ''}`}>
					<div className="col-md-8">
						<label>Для сверки выберите счет-фактуру из списка</label>
						<Select
							name="inboundInvoices"
							value={selectedInvoice}
							noOptionsMessage={() => "Входящие счет-фактуры отсутствуют"}
							onChange={this.invoiceSelectChange}
							placeholder="Выберите счет-фактуру"
							options={inboundInvoices}
						/>
					</div>
				</div>

				{isLoading && <PleaseWait />}

				{!isLoading && Object.keys(selectedInvoice).length > 0 &&
					<Fragment>
						<div className="empty-space"></div>

						<div className="row pt-10">
							<div className="col-md-3">
								<label>При необходимости выберите дату накладной</label>
								<input
									type="date"
									value={dateInvoice}
									className="form-control"
									onChange={this.dateInvoiceChange}>
								</input>
							</div>
							<div className="col-md-6">
								<label>Выберите подходящие накладные</label>
								<Select
									name="internalInvoices"
									value={selectedInternalInvoice}
									noOptionsMessage={() => "Накладные не найдены"}
									onChange={this.internalInvoiceSelectChange}
									placeholder="Выберите накладные"
									options={internalInvoices}
									isMulti={true}
								/>
							</div>
							<div className="col-md-3 text-right">
								<label>Выполнить сверку по выбранным накладным</label><br />
								<button className="btn btn-success" onClick={this.onInternalInvoiceBtn}>
									Выполнить
								</button>
							</div>
						</div>

						{isLoading2 && <PleaseWait />}

						{!isLoading2 &&
							<Fragment>
								<div className="row pt-10">
									<div className="col-md-12">
										<p className="hint">
											Дата выписки ЭСФ: <b>{Moment(selectedInvoice.details.esfdate).format('DD.MM.YYYY')}</b><br />
											Исходящий номер ЭСФ в бухгалтерии: <b>{selectedInvoice.details.esfaccountingnumber}</b><br />
											Дата совершения оборота: <b>{Moment(selectedInvoice.details.turnoverdate).format('DD.MM.YYYY')}</b><br />
											Регистрационный номер в ИС ЭСФ: <b>{selectedInvoice.details.esfregnum}</b><br />
											Поставщик: <b>{`${selectedInvoice.details.sellerBin} | ${selectedInvoice.details.sellerName}` || '-'}</b><br />
											Номер накладной: <b>{selectedInvoice.details.deliverydocnum || '-'}</b><br />
											Дата накладной: <b>{(selectedInvoice.details.deliverydocdate && Moment(selectedInvoice.details.deliverydocdate).format('DD.MM.YYYY')) || '-'}</b>
										</p>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col-md-12">
										<button className="btn btn-secondary" onClick={this.openInvoiceDetails}>
											Просмотреть накладную
										</button>
									</div>
								</div>
								<div className="row mt-10">
									<div className="col-md-12">
										<div>
											<table className="table table-striped table-bordered">
												<thead className="bg-info text-white">
													<tr>
														<td className="text-center">Номер п/п</td>
														<td>Наименование товара в счет-фактуре</td>
														<td className="text-center">№ Декларации на товары</td>
														<td className="text-center">Номер товарной позиции из Декларации</td>
														<td className="text-center">Признак происхождения</td>
														<td className="text-center">Количество</td>
														<td className="text-center">Код ТН ВЭД</td>
														<td className="text-center">Цена (тариф) за единицу товара, работы, услуги без косвенных налогов</td>
														<td className="text-center">Стоимость товаров, работ, услуг без косвенных налогов</td>
														<td className="text-center">Стоимость товаров, работ, услуг с учетом косвенных налогов</td>
														<td className="text-center">Наименование товара на складе <br /> (при необходимости сверки)</td>
													</tr>
												</thead>
												<tbody>
													{inboundInvoiceDetails.map((detail, idx) =>
														<tr key={idx}>
															<td className="text-center">{idx + 1}</td>
															<td>{detail.description}</td>
															<td className="text-center">{detail.declaration}</td>
															<td className="text-center">{detail.numberindeclaration}</td>
															<td className="text-center">{detail.truorigincode}</td>
															<td className="text-center">{detail.quantity}</td>
															<td className="text-center">{detail.unitcode}</td>
															<td className="text-center tenge">{detail.unitprice.toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
															<td className="text-center tenge">{detail.pricewithouttax.toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
															<td className="text-center tenge">{detail.pricewithtax.toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
															<td style={{ width: "30%" }}>
																{(detail.declaration &&
																	<Select
																		name={`product_${idx}`}
																		noOptionsMessage={() => "Товар не найден"}
																		onChange={(e) => this.productListChange(e, detail)}
																		placeholder={detail.name || 'Выберите товар'}
																		onInputChange={this.onProductListInput.bind(this)}
																		options={productOptions || []}
																	/>) || ''}
															</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>
									</div>
									<div className="col-md-6 text-right pt-10">
										<button className="btn btn-success" disabled={isSubmit} onClick={this.onEsfRevising}>
											{isSubmit ? 'Пожалуйста подождите...' : 'Завершить сверку'}
										</button>
									</div>
									<div className="col-md-6 text-right pt-10">
										<button className="btn btn-danger" disabled={isSubmit} onClick={this.onEsfRevisingSkip}>
											{isSubmit ? 'Пожалуйста подождите...' : 'Завершить без сверки'}
										</button>
									</div>
								</div>
							</Fragment>
						}
					</Fragment>}
			</Fragment>
		);
	}
}

export default InboundInvoice;