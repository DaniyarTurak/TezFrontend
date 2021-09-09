import React, { Component } from 'react';
import Axios from 'axios';

import AlertBox from '../AlertBox';
import SweetAlert from 'react-bootstrap-sweetalert';
import Alert from 'react-s-alert';
import Searching from '../Searching';


class SalesPlan extends Component {
	state = {
		indSalesPlan: [],
		teamSalesPlan: [],
		isLoading: true,
		alert: {
			confirmDelete: 'Вы действительно хотите удалить план пользователю?',
			successDelete: 'План успешно удален',
			successEdit: 'Изменения сохранены',
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
		sweetalert: null
	};

	componentDidMount() {
		if (this.props.location.state && this.props.location.state.fromEdit) {
			Alert.success(this.state.alert.successEdit, {
				position: 'top-right',
				effect: 'bouncyflip',
				timeout: 2000
			});
		};

		this.getSalesPlan();
	};

	getSalesPlan = () => {
		Axios.all([
			Axios.get('/api/salesplan/cashboxuser'),
			Axios.get('/api/salesplan/point'),
		]).then(Axios.spread((indSalesPlan, teamSalesPlan) => {
			console.log()
			this.setState({ indSalesPlan: indSalesPlan.data, teamSalesPlan: teamSalesPlan.data, isLoading: false });
		}));
	};

	hideAlert = () => {
		this.setState({
			sweetalert: null
		});
	};

	handleDelete = (item) => {
		this.setState({
			sweetalert: <SweetAlert
				warning
				showCancel
				confirmBtnText={this.state.alert.label.sure}
				cancelBtnText={this.state.alert.label.cancel}
				confirmBtnBsStyle="success"
				cancelBtnBsStyle="default"
				title={this.state.alert.label.areyousure}
				onConfirm={() => this.delete(item)}
				onCancel={() => this.hideAlert()}
			>
				{this.state.alert.confirmDelete}
			</SweetAlert>
		});
	};

	delete = (item) => {
		console.log(item)

		const salesPlan = item.type === 1 ? this.state.indSalesPlan : this.state.teamSalesPlan

		const newSalesPlanList = salesPlan.filter(saleplan => {
			return saleplan !== item
		});

		item.deleted = true;
		const req = { plan: { object: item.id } };

		Axios.post('/api/salesplan/manage', req).then(() => {
			this.setState({
				indSalesPlan: newSalesPlanList
			});

			Alert.success(this.state.alert.successDelete, {
				position: 'top-right',
				effect: 'bouncyflip',
				timeout: 2000
			});

		}).catch(err => {
			Alert.error(err.response.data.code === 'internal_error' ? this.state.alert.raiseError : err.response.data.text, {
				position: 'top-right',
				effect: 'bouncyflip',
				timeout: 2000
			});
		});

		this.hideAlert();
	};

	handleEdit = (salesPlanData) => {
		this.props.history.push({
			pathname: 'salesplan/manage',
			state: { salesPlanData }
		});
	};

	render() {
		const { indSalesPlan, teamSalesPlan, isLoading, label, sweetalert } = this.state;

		return (
			<div className="sales-plan">
				{sweetalert}
				<div className="row">
					<div className="col-md-6">
						<h6 className="btn-one-line">План продаж</h6>
					</div>
					<div className="col-md-6 text-right">
						<button className="btn btn-link btn-sm" onClick={() => this.props.history.push('salesplan/manage')}>
							Внести план продаж
						</button>
					</div>
				</div>

				{isLoading && <Searching />}

				{!isLoading && <div className="empty-space"></div>}

				{!isLoading && indSalesPlan.length === 0 && teamSalesPlan === 0 && <AlertBox text={label.empty} />}

				{!isLoading && indSalesPlan.length > 0 &&
					<div className="row">
						<div className="col-md-12">
							<table className="table table-hover">
								<thead>
									<tr>
										<th style={{ width: "1%" }}
										// rowSpan={2}
										></th>
										<th style={{ width: "21%" }}
										// rowSpan={2} 
										>Имя кассира</th>
										<th style={{ width: "21%" }}
										// rowSpan={2}
										>Название торговой точки</th>
										<th className="text-center" colSpan={0} style={{ width: "12%" }}>Еженедневный</th>
										<th className="text-center" colSpan={0} style={{ width: "12%" }}>Месячный</th>
										<th className="text-center" colSpan={0} style={{ width: "12%" }}>Квартальный</th>
										<th className="text-center" colSpan={0} style={{ width: "12%" }}>Годовой</th>
										<th style={{ width: "9%" }}
										// rowSpan={2}
										></th>
									</tr>
									{/* <tr>


										<th className="text-center" style={{ width: "6%" }}>Сумма</th>
										<th className="text-center" style={{ width: "6%" }}>Процент</th>
										<th className="text-center" style={{ width: "6%" }}>Сумма</th>
										<th className="text-center" style={{ width: "6%" }}>Процент</th>
										<th className="text-center" style={{ width: "6%" }}>Сумма</th>
										<th className="text-center" style={{ width: "6%" }}>Процент</th>
										<th className="text-center" style={{ width: "6%" }}>Сумма</th>
										<th className="text-center" style={{ width: "6%" }}>Процент</th>
									</tr> */}
								</thead>
								<tbody>
									<tr className="bg-info" style={{ color: "#fff" }}>
										<td colSpan="12">Индивидуальный план</td>
									</tr>

									{indSalesPlan.map((saleplan, idx) =>
										<tr key={idx}>
											<td>{idx + 1}</td>
											<td>{saleplan.name}</td>
											<td>{saleplan.pointName}</td>
											<td title="Сумма | Ставка для расчета бонусов" className={`text-center`}>{saleplan.daily && parseFloat(saleplan.daily).toLocaleString('ru', { minimumFractionDigits: 2 })} &#8376;
												| {saleplan.drate && parseFloat(saleplan.drate).toLocaleString('ru', { minimumFractionDigits: 1 })} %
											</td>
											<td title="Сумма | Ставка для расчета бонусов" className={`text-center`}>{saleplan.monthly && parseFloat(saleplan.monthly).toLocaleString('ru', { minimumFractionDigits: 2 })} &#8376;
												| {saleplan.mrate && parseFloat(saleplan.mrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %
											</td>
											<td title="Сумма | Ставка для расчета бонусов" className={`text-center`}>{saleplan.quarterly && parseFloat(saleplan.quarterly).toLocaleString('ru', { minimumFractionDigits: 2 })} &#8376;
												| {saleplan.qrate && parseFloat(saleplan.qrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %
											</td>
											<td title="Сумма | Ставка для расчета бонусов" className={`text-center`}>{saleplan.yearly && parseFloat(saleplan.yearly).toLocaleString('ru', { minimumFractionDigits: 2 })} &#8376;
												| {saleplan.yrate && parseFloat(saleplan.yrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %
											</td>
											{/* <td className={`text-center ${saleplan.daily ? 'tenge' : ''}`}>{saleplan.daily && parseFloat(saleplan.daily).toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
											<td className={`text-center ${saleplan.drate ? 'percent' : ''}`}>{saleplan.drate && parseFloat(saleplan.drate).toLocaleString('ru', { minimumFractionDigits: 1 })} %</td>

											<td className={`text-center ${saleplan.monthly ? 'tenge' : ''}`}>{saleplan.monthly && parseFloat(saleplan.monthly).toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
											<td className={`text-center ${saleplan.mrate ? 'percent' : ''}`}>{saleplan.mrate && parseFloat(saleplan.mrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %</td>

											<td className={`text-center ${saleplan.quarterly ? 'tenge' : ''}`}>{saleplan.quarterly && parseFloat(saleplan.quarterly).toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
											<td className={`text-center ${saleplan.qrate ? 'percent' : ''}`}>{saleplan.qrate && parseFloat(saleplan.qrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %</td>

											<td className={`text-center ${saleplan.yearly ? 'tenge' : ''}`}>{saleplan.yearly && parseFloat(saleplan.yearly).toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
											<td className={`text-center ${saleplan.drate ? 'percent' : ''}`}>{saleplan.yrate && parseFloat(saleplan.yrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %</td> */}

											<td className="text-right">
												<button className="btn btn-w-icon edit-item"
													onClick={() => { this.handleEdit(saleplan) }}>
												</button>
												<button className="btn btn-w-icon delete-item"
													onClick={() => { this.handleDelete(saleplan) }}>
												</button>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				}

				{!isLoading && teamSalesPlan.length > 0 &&
					<div className="row">
						<div className="col-md-12">
							<table className="table table-hover">
								<thead>
									<tr>
										<th style={{ width: "1%" }}></th>
										<th style={{ width: "42%" }}>Название торговой точки</th>
										<th className="text-center" style={{ width: "12%" }}>Еженедневный</th>
										<th className="text-center" style={{ width: "12%" }}>Месячный</th>
										<th className="text-center" style={{ width: "12%" }}>Квартальный</th>
										<th className="text-center" style={{ width: "12%" }}>Годовой</th>
										<th style={{ width: "9%" }}></th>
									</tr>
								</thead>
								<tbody>
									<tr className="bg-info" style={{ color: "#fff" }}>
										<td colSpan="8">Комадный план</td>
									</tr>

									{teamSalesPlan.map((saleplan, idx) =>
										<tr key={idx}>
											<td>{idx + 1}</td>
											<td>{saleplan.name}</td>
											<td title="Сумма | Ставка для расчета бонусов" className={`text-center`}>{saleplan.daily && parseFloat(saleplan.daily).toLocaleString('ru', { minimumFractionDigits: 2 })} &#8376;
												| {saleplan.drate && parseFloat(saleplan.drate).toLocaleString('ru', { minimumFractionDigits: 1 })} %
											</td>
											<td title="Сумма | Ставка для расчета бонусов" className={`text-center`}>{saleplan.monthly && parseFloat(saleplan.monthly).toLocaleString('ru', { minimumFractionDigits: 2 })} &#8376;
												| {saleplan.mrate && parseFloat(saleplan.mrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %
											</td>
											<td title="Сумма | Ставка для расчета бонусов" className={`text-center`}>{saleplan.quarterly && parseFloat(saleplan.quarterly).toLocaleString('ru', { minimumFractionDigits: 2 })} &#8376;
												| {saleplan.qrate && parseFloat(saleplan.qrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %
											</td>
											<td title="Сумма | Ставка для расчета бонусов" className={`text-center`}>{saleplan.yearly && parseFloat(saleplan.yearly).toLocaleString('ru', { minimumFractionDigits: 2 })} &#8376;
												| {saleplan.yrate && parseFloat(saleplan.yrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %
											</td>

											{/* <td className={`text-center ${saleplan.daily ? 'tenge' : ''}`}>{saleplan.daily && parseFloat(saleplan.daily).toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
											<td className={`text-center ${saleplan.drate ? 'percent' : ''}`}>{saleplan.drate && parseFloat(saleplan.drate).toLocaleString('ru', { minimumFractionDigits: 1 })} %</td>

											<td className={`text-center ${saleplan.monthly ? 'tenge' : ''}`}>{saleplan.monthly && parseFloat(saleplan.monthly).toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
											<td className={`text-center ${saleplan.mrate ? 'percent' : ''}`}>{saleplan.mrate && parseFloat(saleplan.mrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %</td>

											<td className={`text-center ${saleplan.quarterly ? 'tenge' : ''}`}>{saleplan.quarterly && parseFloat(saleplan.quarterly).toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
											<td className={`text-center ${saleplan.qrate ? 'percent' : ''}`}>{saleplan.qrate && parseFloat(saleplan.qrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %</td>

											<td className={`text-center ${saleplan.yearly ? 'tenge' : ''}`}>{saleplan.yearly && parseFloat(saleplan.yearly).toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
											<td className={`text-center ${saleplan.yrate ? 'percent' : ''}`}>{saleplan.yrate && parseFloat(saleplan.yrate).toLocaleString('ru', { minimumFractionDigits: 1 })} %</td> */}

											<td className="text-right">
												<button className="btn btn-w-icon edit-item"
													onClick={() => { this.handleEdit(saleplan) }}>
												</button>
												<button className="btn btn-w-icon delete-item"
													onClick={() => { this.handleDelete(saleplan) }}>
												</button>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				}
			</div>
		);
	}
}

export default SalesPlan;