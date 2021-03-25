import React, { Component } from 'react';
import Select from 'react-select';
import Axios from 'axios';

import SweetAlert from 'react-bootstrap-sweetalert';
import Alert from 'react-s-alert';

class PointPage extends Component {

	state = {
		label: {
			name: 'Название торговой точки',
			address: 'Адрес торговой точки',
			is_minus: 'Разрешить отрицательный учет товаров?',
			header: 'Детали торговой точки',
			newStock: 'Привязать новые склады',
			stockList: 'Привязанные склады',
			showStockList: 'Показать список привязанных складов',
			noStock: 'Все склады привязаны к данной точке',
			noRelatedStock: 'Нет привязанных складов',
			buttonLabel: {
				edit: 'Редактировать',
				add: 'Добавить выбранные склады'
			},
			title: {
				delete: 'Удалить'
			}
		},
		alert: {
			confirmDelete: 'Вы действительно хотите убрать связь?',
			successDelete: 'Связь склада с точкой удалена',
			successRelate: 'Связь склада с точкой успешно добавлена',
			raiseError: 'Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже',
			label: {
				ok: 'Хорошо',
				sure: 'Да, я уверен',
				cancel: 'Нет, отменить',
				areyousure: 'Вы уверены?',
				success: 'Отлично',
				error: 'Упс...Ошибка!'
			}
		},
		point: this.props.location.state.point,
		relatedStock: [],
		addList: [],
		addStock: false,
		options: [],
		isLoading: true,
		sweetalert: null
	};

	componentDidMount() {
		this.getRelatedStocks();
	};

	hideAlert = () => {
		this.setState({
			sweetalert: null
		});
	};

	getStocks = () => {
		const relatedStock = this.state.relatedStock;

		Axios.get('/api/stock')
			.then(stockList => {
				let options = [], filteredList = [];
				filteredList = stockList.data.filter(stock => stock.point_type !== 0);
				let difference = filteredList.filter(fl => {
					return !relatedStock.some(rs => {
						return fl.id === rs.id;
					});
				});

				difference.map(stock => options.push({ label: stock.name, value: stock.id, address: stock.address }));
				this.setState({
					options,
					isLoading: false
				})
			})
			.catch(err => {
				console.log(err);
			})
	};

	getRelatedStocks = () => {
		Axios.get('/api/stock/related', {
			params: {
				pointid: this.state.point.id
			}
		}).then(stockList => {
			this.setState({
				relatedStock: stockList.data,
				isLoading: false
			})
		}).catch(err => {
			console.log(err);
		})
	};

	handleChange = (stockList) => {
		let lst = [];
		stockList.map(stock => lst.push({ id: stock.value, name: stock.label, address: stock.address }));
		this.setState({
			addList: lst
		});
	};

	handleHide = () => {
		!this.state.addStock ? this.getStocks() : this.getRelatedStocks();
		this.setState({
			addStock: !this.state.addStock,
			isLoading: true
		});
	};

	handleAddStock = () => {
		let attachments = []
		this.state.addList.map(l => {
			return attachments.push({ stock: l.id })
		});

		const req = {
			point: this.state.point.id,
			attachments: attachments
		};

		Axios.post('/api/point/manage/attachstock', req)
			.then(() => {
				const relatedStock = this.state.relatedStock;

				this.state.addList.map(stock => {
					return relatedStock.push({
						id: stock.id,
						name: stock.name,
						address: stock.address
					})
				});

				Alert.success(this.state.alert.successRelate, {
					position: 'top-right',
					effect: 'bouncyflip',
					timeout: 2000
				});

				this.handleHide();

			})
			.catch(err => {
				Alert.error(err.response.data.code === 'internal_error' ? this.state.alert.raiseError : err.response.data.text, {
					position: 'top-right',
					effect: 'bouncyflip',
					timeout: 2000
				});
			})
	};

	handleDeleteStock = (stockid) => {
		this.setState({
			sweetalert: <SweetAlert
				warning
				showCancel
				confirmBtnText={this.state.alert.label.sure}
				cancelBtnText={this.state.alert.label.cancel}
				confirmBtnBsStyle="success"
				cancelBtnBsStyle="default"
				title={this.state.alert.label.areyousure}
				onConfirm={() => this.deleteStock(stockid)}
				onCancel={() => this.hideAlert()}
			>
				{this.state.alert.confirmDelete}
			</SweetAlert>
		});
	};

	deleteStock = (stockid) => {
		const req = {
			point: this.state.point.id,
			stock: stockid
		};

		Axios.post('/api/point/manage/attachstockdel', req)
			.then(res => {
				const relatedStock = this.state.relatedStock.filter(stock => {
					return stock.id !== stockid
				});

				this.setState({
					relatedStock
				});

				Alert.success(this.state.alert.successDelete, {
					position: 'top-right',
					effect: 'bouncyflip',
					timeout: 2000
				});

				this.hideAlert();

			})
			.catch(err => {
				Alert.error(err.response.data.code === 'internal_error' ? this.state.alert.raiseError : err.response.data.text, {
					position: 'top-right',
					effect: 'bouncyflip',
					timeout: 2000
				});
			})
	};

	handleEdit = () => {
		sessionStorage.setItem('point', JSON.stringify());

		this.props.history.push({
			pathname: '../point/manage',
			state: { pointData: this.state.point }
		});
	};

	render() {
		const { label, point, relatedStock, addStock, options, isLoading, sweetalert } = this.state;
		return (
			<div className="point-page">

				{sweetalert}

				<Alert stack={{ limit: 3 }} offset={50} />

				<div className="point-info">
					<div className="row">
						<div className="col-md-6">
							<h6 className="btn-one-line">{label.header}</h6>
						</div>
						<div className="col-md-6 text-right">
							<button className="btn btn-link btn-sm" onClick={() => this.handleEdit()}>
								{label.buttonLabel.edit}
							</button>
						</div>
					</div>

					<div className="empty-space"></div>

					<dl>
						<dt>{label.name}</dt>
						<dd>{point.name}</dd>

						<dt>{label.address}</dt>
						<dd>{point.address}</dd>

						<dt>{label.is_minus}</dt>
						<dd>{point.is_minus ? 'Да' : 'Нет'}</dd>
					</dl>

					<div className="empty-space"></div>

					<div className="row mt-10">
						<div className="col-md-6">
							<h6>{addStock ? label.newStock : label.stockList}</h6>
						</div>
						<div className="col-md-6 text-right">
							<button className="btn btn-link btn-sm" onClick={this.handleHide}>
								{addStock ? label.showStockList : label.newStock}
							</button>
						</div>
					</div>

					{!addStock &&
						<div className={`content mt-30 ${isLoading ? 'is-loading' : ''}`}>
							<div className="loader">
								<div className="icon"></div>
							</div>

							{!isLoading && relatedStock.length > 0 &&
								<dl>
									{relatedStock.map(stock =>
										<div key={stock.id}>
											<dt>
												<h6 className="related-stock-name">{stock.name}</h6>
												<p className="related-stock-address">{stock.address}</p>
											</dt>
											<dd className="text-right">
												<button className="btn btn-w-icon delete-item" title={label.title.delete}
													onClick={() => { this.handleDeleteStock(stock.id) }}>
												</button>
											</dd>
										</div>
									)}
								</dl>
							}

							{!isLoading && !addStock && relatedStock.length === 0 &&
								<div className="text-center not-found-text">
									<p>{label.noRelatedStock}</p>
								</div>
							}
						</div>
					}
				</div>

				{addStock &&
					<div className={`content mt-30 ${isLoading ? 'is-loading' : ''}`}>
						<div className="loader">
							<div className="icon"></div>
						</div>
						{!isLoading && options.length > 0 &&
							<div className="row">
								<div className="col-md-12 relate-stock">
									<Select
										options={this.state.options || []}
										placeholder="Выберите склад(-ы)"
										onChange={this.handleChange}
										isMulti
									/>

									<button className="btn btn-success" style={{ marginTop: "10px", float: "right" }} onClick={() => this.handleAddStock()}>
										{label.buttonLabel.add}
									</button>
								</div>
							</div>

						}

						{!isLoading && options.length === 0 &&
							<div className="text-center products-not-found">
								<p>{label.noStock}</p>
							</div>
						}
					</div>
				}
			</div>
		)
	}
}

export default PointPage