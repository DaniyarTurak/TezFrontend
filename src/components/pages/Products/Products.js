import React, { Component } from 'react';
import Breadcrumb from '../../Breadcrumb';

import Alert from 'react-s-alert';
import Axios from 'axios';

class Products extends Component {
	state = {
		breadcrumb: [
			{ caption: 'Товары', active: true }
		],
		isLoading: false,
		clickedBtn: '',
		label: {
			receive: 'Прием нового товара на склад',
			transfer: 'Перемещение между складами',
			changePrice: 'Изменение цен',
			writeoff: 'Списание товара со склада',
			pleaseWait: 'Пожалуйста подождите...'
		},
		alert: {
			successSubmit: 'Накладная успешно сохранена',
			successInvoiceDelete: 'Накладная успешно удалена',
			successChangePrice: 'Цены успешно изменены',
			receiveFirst: 'Сначала необходимо выполнить прием новых товаров!'
		},
	};

	handlePath = (e) => {
		this.setState({ clickedBtn: e.target.name, isLoading: true });
		this.path(e);
	};

	path = (e) => {
		const target = e.target.name;

		if (target === 'transfer' || target === 'changeprice') {
			Axios.get('/api/stockcurrent/hasproducts')
				.then((res) => res.data.count)
				.then((count) => {
					if (count === '0') {
						Alert.info(this.state.alert.receiveFirst, {
							position: 'top-right',
							effect: 'bouncyflip',
							timeout: 2000
						});
						this.setState({ isLoading: false });
					} else {
						this.props.history.push('product/' + target);
					}
				}).catch((err) => {
					console.log(err)
				})
		} else {
			this.props.history.push('product/' + target);
		}

	};

	componentDidMount() {
		if (this.props.location.state) {
			if (this.props.location.state.fromSubmitInvoice) {
				Alert.success(this.state.alert.successSubmit, {
					position: 'top-right',
					effect: 'bouncyflip',
					timeout: 2000
				});
			} else if (this.props.location.state.fromChangePrice) {
				Alert.success(this.state.alert.successChangePrice, {
					position: 'top-right',
					effect: 'bouncyflip',
					timeout: 2000
				});
			}else if (this.props.location.state.successInvoiceDelete) {
				Alert.success(this.state.alert.successInvoiceDelete, {
					position: 'top-right',
					effect: 'bouncyflip',
					timeout: 2000
				});
			}
		}
	};

	render() {
		const { breadcrumb, label, isLoading, clickedBtn } = this.state;
		return (
			<div className="products">
				<Breadcrumb content={breadcrumb} />

				<div className="row">
					<div className="col-md-3">
						<button className="btn btn-block btn-outline-success" disabled={(isLoading && clickedBtn === "receive")} name="receive" onClick={this.handlePath}>
							{(isLoading && clickedBtn === "receive") ? label.pleaseWait : label.receive}
						</button>
					</div>
					<div className="col-md-3">
						<button className="btn btn-block btn-outline-success" disabled={(isLoading && clickedBtn === "transfer")} name="transfer" onClick={this.handlePath}>
							{(isLoading && clickedBtn === "transfer") ? label.pleaseWait : label.transfer}
						</button>
					</div>
					<div className="col-md-3">
						<button className="btn btn-block btn-outline-success" disabled={(isLoading && clickedBtn === "changeprice")} name="changeprice" onClick={this.handlePath}>
							{(isLoading && clickedBtn === "changeprice") ? label.pleaseWait : label.changePrice}
						</button>
					</div>
					<div className="col-md-3">
						<button className="btn btn-block btn-outline-success" disabled={(isLoading && clickedBtn === "writeoff")} name="writeoff" onClick={this.handlePath}>
							{(isLoading && clickedBtn === "writeoff") ? label.pleaseWait : label.writeoff}
						</button>
					</div>
				</div>
			</div>
		)
	}
}

export default Products