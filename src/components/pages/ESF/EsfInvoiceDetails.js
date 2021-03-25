import React, { Component/*, Fragment*/ } from 'react';
// import Moment from 'moment';

class EsfInvoiceDetails extends Component {
	state = {
		invoice: JSON.parse(sessionStorage.getItem('isme-esf-invoice-details'))
	};

	componentDidMount() {
		console.log(this.state.invoice)
	};

	render() {
		const { invoice } = this.state;
		return (
			<div className="container-fluid">
				<div className="row mt-20">
					{/* <div className="col-md-12">
						<b>Накладная {invoice.altnumber} от {Moment(invoice.invoicedate).format('DD.MM.YYYY')}</b>

						<p className="product-transfer-stocks">
							{<Fragment>Контрагент: {invoice.counterparty && `${invoice.bin} | ${invoice.counterparty}`}</Fragment>}
						</p>
					</div> */}
					<div className="col-md-12">
						<table className="table table-hover">
							<thead>
								<tr>
									<th style={{ width: "2%" }}></th>
									<th style={{ width: "30%" }}>Наименование товара</th>
									<th style={{ width: "20%" }}>Штрих код</th>
									<th>Цена закупки</th>
									<th>Цена продажи</th>
									<th>Налоговая категория</th>
									<th>Код ТН ВЭД</th>
									<th style={{ width: "10%" }} className="text-center">Количество</th>
								</tr>
							</thead>
							<tbody>
								{invoice.map((detail, idx) =>
									<tr key={idx}>
										<td>{idx + 1}</td>
										<td>{detail.name + (detail.attributescaption ? ', ' + detail.attributescaption : detail.attributescaption)}</td>
										<td>{detail.code}</td>
										<td className={`${detail.purchaseprice ? 'tenge' : ''}`}>{detail.purchaseprice && parseFloat(detail.purchaseprice).toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
										<td className="tenge">{parseFloat(detail.newprice).toLocaleString('ru', { minimumFractionDigits: 2 })}</td>
										<td>{detail.taxid === '0' ? 'Без НДС' : 'Стандартный НДС'}</td>
										<td>{detail.cnofeacode}</td>
										<td className="text-center">{detail.units}</td>
									</tr>
								)}
							</tbody>
							<tfoot className="bg-info text-white">
								<tr>
									<td colSpan={7}>Итого</td>
									<td className="text-center">{
										invoice.reduce((prev, cur) => {
											return prev + cur.units;
										}, 0)
									}</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			</div>
		);
	}
}

export default EsfInvoiceDetails;