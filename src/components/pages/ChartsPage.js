import React, { Component,Fragment } from 'react';
import Axios from 'axios';
import Searching from "../Searching";

import {FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, LineMarkSeries, VerticalGridLines, Crosshair, DiscreteColorLegend, 
	VerticalBarSeries,Hint} from 'react-vis';

class ChartsPage extends Component {

	state = {
		companyData: JSON.parse(sessionStorage.getItem('isme-company-data')) || {},
		sidebarToggeled: JSON.parse(sessionStorage.getItem('isme-sidebar-toggle')) || { isToggled: window.innerWidth > 1366 },
		isEdit: false,
		isEdited: false,
		label: {
			companyInfo: 'Общая информация по компании',
			companyBin: 'БИН',
			companyName: 'Название компании',
			companyAddress: 'Юридический адрес компании',
			companyHead: 'Руководитель',
			companyHeadIDN: 'ИИН Руководителя',
			companyAccountant: 'Главный бухгалтер',
			companyAccountantIDN: 'ИИН главного бухгалтера',
			buttonLabel: {
				edit: 'Редактировать',
				save: 'Сохранить изменения',
				cancel: 'Отменить'
			}
		},
		alert: {
			label: {
				ok: 'Хорошо',
				sure: 'Да, я уверен',
				cancel: 'Нет, отменить',
				areyousure: 'Вы уверены?',
				success: 'Отлично',
				error: 'Упс...Ошибка!'
			},
			successEdit: 'Изменения сохранены',
			successChangePass: 'Пароль успешно изменен',
			raiseError: 'Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже'
		},		
		field: {
			type: 'plainText'
		},
		isLoading: [true,true,true,true,true,true,true],
		editEnabled: false,
		
		DATA: [],
		DATA2: [],
		DATA3: [],
		DATA4: [],
		DATA5: [],
		DATA6: [],
		DATA7: [],

		ITEMS: [], 
		ITEMS2: [], 
		ITEMS3: [], 
		ITEMS4: [], 
		ITEMS5: [], 
		ITEMS6: [], 
		ITEMS7: [], 

		indx: null,
		indx4: null,
		indx5: null,
		indx6: null,
		indx7: null,

		myColorArray: ['#4BBF7E','#4BBFAC','#3B76AA','#274C6D','#5BA7EA','#CAD637','#F4CB12','#F48612','#F45012', '#CC908C', '#CB2A22', '#EA50DC', '#BD24F7'],
		graphPointTitle: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],

		secondGraphXTitle: [],
		thirdGraphXTitle: [],
		thirdGraphFullXTitles: [],
		fourthGraphXTitle: [],
		seventhGraphXTitle: [],
		seventhGraphFullXTitles: [],

		crosshairValues: null,
		crosshairValues2: [],
		crosshairValues3: [],
		crosshairValues4: null,
		crosshairValues5: null,
		crosshairValues6: null,
		crosshairValues7: null,

		composNumber: 7,
		xTitleDisplayRange: 2//не может быть нечетным
	};
	
	parseName=(str)=>{
		const {graphPointTitle} = this.state
		const day = str.substr(0,str.indexOf('.'))
		const month = str.substr(str.indexOf('.')+1,str.length)
		return graphPointTitle[parseInt(month,10)-1] + ', ' + day
	}

	parseNameWithEmptySpaces=(str,index)=>{
		const {graphPointTitle,xTitleDisplayRange} = this.state
		const day = str.substr(0,str.indexOf('.'))
		const month = str.substr(str.indexOf('.')+1,str.length)
		if(index===0) return graphPointTitle[parseInt(month,10)-1] + ', ' + day
		if(index%xTitleDisplayRange===0) {
			if(parseInt(day,10)<=xTitleDisplayRange) return graphPointTitle[parseInt(month,10)-1] + ', ' + day
			else return day
		}
		return ''
	}

	componentWillMount() {
		this.getSellPrice();
		this.getAvarageTicket();
		this.getTicketCount();
		this.getAvarageSum();
		this.getAvarageTicketColumnGraph();
		this.getTicketCountColumnGraph();
		this.getDailySales();
	};

	componentDidUpdate = () => {
		let {sidebarToggeled} = this.state
		if(JSON.parse(sessionStorage.getItem('isme-sidebar-toggle')) && sidebarToggeled.isToggled !== JSON.parse(sessionStorage.getItem('isme-sidebar-toggle')).isToggled){
			sidebarToggeled.isToggled = !sidebarToggeled.isToggled
			this.setState({sidebarToggeled})

			setTimeout(()=>{
				this.setState({state:this.state})
			}, 100);
			setTimeout(()=>{
				this.setState({state:this.state})
			}, 200);
			setTimeout(()=>{
				this.setState({state:this.state})
			}, 300);
			setTimeout(()=>{
				this.setState({state:this.state})
			}, 400);
			setTimeout(()=>{
				this.setState({state:this.state})
			}, 500);
		}
	}

	getDayCount(month){
		const today = new Date();
		const currMonthNumber = parseInt(today.getMonth(),10)+1
		const currMontDayNumber = parseInt(today.getDate(),10)-1
		let year = parseInt(today.getFullYear(),10)
		month = parseInt(month,10)
		if(month===currMonthNumber)return currMontDayNumber
		if(month>currMonthNumber)
			year -= 1

		const theNextMonthDate = new Date(year, month , 1); 
		const lastDayOfMonth = new Date(theNextMonthDate - 1);
		return parseInt(lastDayOfMonth.getDate(),10)
	}

	getSellPrice = () => {
		const {graphPointTitle,isLoading} = this.state
		Axios.get('/api/graph').then(res => res.data)
			.then((data) => {
				let DATA = []

				let ITEMS = [];
				
				data.forEach((point,index)=>{
					ITEMS.push({title:point.name,strokeWidth: 15})
					let newCol = []
					point.mlist.forEach((month,index)=>{
						let sum = 0
						point.trans.forEach((trans,index)=>{
							if(trans[month]){
								sum = trans[month]
								return
							}
						})
						newCol.push({x:graphPointTitle[parseInt(month,10)-1],y:parseInt(sum,10)})						
					})
					DATA.push(newCol)
				})

				isLoading[0] = false
				this.setState({ITEMS,DATA,isLoading})
			})
			.catch((err) => { 
				console.log(err)
				isLoading[0] = false
				this.setState({isLoading})
			})
	}

	getAvarageSum = () => {
		const {graphPointTitle,isLoading} = this.state
		Axios.get('/api/graph/avgsumweek').then(res => res.data)
			.then((data) => {
				let DATA4 = []

				let ITEMS4 = [];
				
				data.forEach((point,index)=>{
					ITEMS4.push({title:point.name,strokeWidth: 15})
					let newCol = []
					point.mlist.forEach((month,index)=>{
						let sum = 0
						point.trans.forEach((trans,index)=>{
							if(trans[month]){
								sum = parseInt(trans[month],10)/this.getDayCount(month)
								return
							}
						})
						newCol.push({x:graphPointTitle[parseInt(month,10)-1],y:parseInt(sum,10)})						
					})
					DATA4.push(newCol)
				})

				isLoading[3] = false
				this.setState({ITEMS4,DATA4,isLoading})
			})
			.catch((err) => { 
				console.log(err)
				isLoading[3] = false
				this.setState({isLoading})
			})
	}

	getAvarageTicket = () => {
		const {composNumber,isLoading} = this.state
		Axios.get('/api/graph/avgticket').then(res => res.data)
			.then((data) => {
				let DATA2 = []

				let ITEMS2 = [];
				
				const secondGraphXTitle = []

				data.forEach((point)=>{
					ITEMS2.push({title:point.name,strokeWidth: 15})
					let newCol = []
					let sum = 0
					let tcount = 0 
					let startName = ''
					point.mlist.forEach((day,index)=>{
						point.trans.forEach((trans)=>{
							if(trans[day]){
								sum += parseFloat(trans[day])
								tcount += parseFloat(trans.count)
								return
							}
						})

						if(startName === ''){
							startName = day
						}
						
						if(index%(composNumber)===(composNumber-1)||index===(point.mlist.length-1)){
							composNumber===1?
							secondGraphXTitle.push(this.parseNameWithEmptySpaces(day,index))
							:
							secondGraphXTitle.push(this.parseName(startName) + " - " +  this.parseName(day))
							newCol.push({x:parseInt(index/composNumber,10),y:parseInt(tcount?sum/tcount:0,10)})
							sum=0
							tcount = 0 
							startName = ''
						}

					})
					DATA2.push(newCol)
				})

				isLoading[1] = false
				this.setState({ITEMS2,DATA2,secondGraphXTitle,isLoading})
			})
			.catch((err) => { 
				console.log(err)
				isLoading[1] = false
				this.setState({isLoading})
			})
	}

	getTicketCount = () => {
		const {composNumber,isLoading} = this.state
		Axios.get('/api/graph/countticket').then(res => res.data)
			.then((data) => {
				let DATA3 = []
				let ITEMS3 = [];
				const thirdGraphXTitle = []
				const thirdGraphFullXTitles = []

				data.forEach((point)=>{
					ITEMS3.push({title:point.name,strokeWidth: 15})
					let newCol = []
					let sum = 0
					let startName = ''
					point.mlist.forEach((day,index)=>{
						point.trans.forEach((trans)=>{
							if(trans[day]){
								sum += parseFloat(trans[day])
								return
							}
						})

						if(startName === ''){
							startName = day
						}
						
						if(index%(composNumber)===(composNumber-1)||index===(point.mlist.length-1)){
							thirdGraphFullXTitles.push(this.parseName(day))
							composNumber===1?
							thirdGraphXTitle.push(this.parseNameWithEmptySpaces(day,index))
							:
							thirdGraphXTitle.push(this.parseName(startName) + " - " +  this.parseName(day))
							newCol.push({x:parseInt(index/composNumber,10),y:parseFloat((sum/(index%composNumber+1)).toFixed(2))})
							sum=0
							startName = ''
						}

					})
					DATA3.push(newCol)
				})

				isLoading[2] = false
				this.setState({DATA3, ITEMS3, thirdGraphXTitle,thirdGraphFullXTitles,isLoading})
			})
			.catch((err) => { 
				console.log(err)
				isLoading[2] = false
				this.setState({isLoading})
			})
	}

	getTicketCountColumnGraph = () => {
		const {graphPointTitle,isLoading} = this.state
		Axios.get('/api/graph/countticketmonth').then(res => res.data)
			.then((data) => {
				let DATA5 = []

				let ITEMS5 = [];
				
				data.forEach((point,index)=>{
					ITEMS5.push({title:point.name,strokeWidth: 15})
					let newCol = []
					point.mlist.forEach((month,index)=>{
						let sum = 0
						point.trans.forEach((trans,index)=>{
							if(trans[month]){
								sum = trans[month]/this.getDayCount(month)
								return
							}
						})
						newCol.push({x:graphPointTitle[parseInt(month,10)-1],y:parseFloat(sum.toFixed(2))})						
					})
					DATA5.push(newCol)
				})

				isLoading[4] = false
				this.setState({ITEMS5,DATA5,isLoading})
			})
			.catch((err) => { 
				console.log(err)
				isLoading[4] = false
				this.setState({isLoading})
			})
	}

	getAvarageTicketColumnGraph = () => {
		const {graphPointTitle,isLoading} = this.state
		Axios.get('/api/graph/avgticketmonth').then(res => res.data)
			.then((data) => {
				let DATA6 = []

				let ITEMS6 = [];
				
				data.forEach((point,index)=>{
					ITEMS6.push({title:point.name,strokeWidth: 15})
					let newCol = []
					point.mlist.forEach((month,index)=>{
						let sum = 0
						point.trans.forEach((trans,index)=>{
							if(trans[month]){
								sum = trans[month]
								return
							}
						})
						newCol.push({x:graphPointTitle[parseInt(month,10)-1],y:parseInt(sum,10)})						
					})
					DATA6.push(newCol)
				})

				isLoading[5] = false
				this.setState({ITEMS6,DATA6,isLoading})
			})
			.catch((err) => { 
				console.log(err)
				isLoading[5] = false
				this.setState({isLoading})
			})
	}

	getDailySales = () => {
		const {isLoading} = this.state
		Axios.get('/api/graph/dailysales').then(res => res.data)
			.then((data) => {
				let DATA7 = []
				let ITEMS7 = [];
				let seventhGraphXTitle = []
				let seventhGraphFullXTitles = []

				data.forEach((point,ind)=>{
					ITEMS7.push({title:point.name,strokeWidth: 15})
					let newCol = []
					point.mlist.forEach((month,index)=>{
						let sum = 0
						point.trans.forEach((trans,index)=>{
							if(trans[month]){
								sum = trans[month]
								return
							}
						})
						newCol.push({x:index,y:parseInt(sum,10)})						
						ind===0&&seventhGraphXTitle.push(this.parseNameWithEmptySpaces(month,index))
						ind===0&&seventhGraphFullXTitles.push(this.parseName(month))
					})
					DATA7.push(newCol)
				})

				isLoading[6] = false
				this.setState({ITEMS7,DATA7,isLoading,seventhGraphXTitle,seventhGraphFullXTitles})
				
			})
			.catch((err) => { 
				console.log(err)
				isLoading[6] = false
				this.setState({isLoading})
			})
	}

	getColor = (indx) => {
		const {myColorArray} = this.state
		return myColorArray[indx]?myColorArray[indx]:myColorArray[indx%myColorArray.length]
	}

	onMouseLeave = () => {
		this.setState({crosshairValues:null});
	};

	onNearestX = crosshairValues => {
		const {DATA} = this.state
		let indx = null
		DATA[0].forEach((element,ind)=>{
			if(element.x===crosshairValues.x){
				indx = ind
				return
			}
		})
		this.setState({crosshairValues,indx});
	};

	onMouseLeave2 = () => {
		this.setState({crosshairValues2:[]});
	};

	onNearestX2 = (value, {index}) =>	{
		const {DATA2} = this.state
		this.setState({
			crosshairValues2: DATA2.map(d => d[index].y !== null && d[index])
		});
	}

	onMouseLeave3 = () => {
		this.setState({crosshairValues3:[]});
	};

	onNearestX3 = (value, {index}) =>	{
		const {DATA3} = this.state
		this.setState({
			crosshairValues3: DATA3.map(d => d[index].y !== null && d[index])
		});
	}

	onMouseLeave4 = () => {
		this.setState({crosshairValues4:null});
	};

	onNearestX4 = (value, {index}) =>	{
		const {DATA4} = this.state
		let indx4 = null
		DATA4[0].forEach((element,ind)=>{
			if(element.x===value.x){
				indx4 = ind
				return
			}
		})
		this.setState({crosshairValues4:value,indx4});
	}

	onMouseLeave5 = () => {
		this.setState({crosshairValues5:null});
	};

	onNearestX5 = (value, {index}) =>	{
		const {DATA5} = this.state
		let indx5 = null
		DATA5[0].forEach((element,ind)=>{
			if(element.x===value.x){
				indx5 = ind
				return
			}
		})
		this.setState({crosshairValues5:value,indx5});
	}

	onMouseLeave6 = () => {
		this.setState({crosshairValues6:null});
	};

	onNearestX6 = (value, {index}) =>	{
		const {DATA6} = this.state
		let indx6 = null
		DATA6[0].forEach((element,ind)=>{
			if(element.x===value.x){
				indx6 = ind
				return
			}
		})
		this.setState({crosshairValues6:value,indx6});
	}

	onMouseLeave7 = () => {
		this.setState({crosshairValues7:null});
	};

	onNearestX7 = (value, {index}) =>	{
		const {DATA7} = this.state
		let indx7 = null
		DATA7[0].forEach((element,ind)=>{
			if(element.x===value.x){
				indx7 = ind
				return
			}
		})
		this.setState({crosshairValues7:value,indx7});
	}

	render() {
		const { DATA,DATA2,DATA3,DATA4,DATA5,DATA6,DATA7,
			ITEMS,ITEMS2,ITEMS3,ITEMS4,ITEMS5,ITEMS6,ITEMS7,
			secondGraphXTitle,thirdGraphXTitle,seventhGraphXTitle,seventhGraphFullXTitles,
			indx,indx4,indx5,indx6,indx7,
			crosshairValues, crosshairValues2, crosshairValues3, crosshairValues4, crosshairValues5, crosshairValues6, crosshairValues7,
			myColorArray,composNumber,isLoading } = this.state;
		
		return (
			<div className="charts-page">
				<div style={{display:'flex'}}>
					<div className="chart-container">
						<div style={{textAlign:'center',marginTop:'20px'}}>Сумма продаж по точкам в разрезе 6 последних месяцев</div>
						{isLoading[0] ? 
							<Searching />
							:(DATA.length>0?
							<FlexibleWidthXYPlot xType="ordinal" height={350} stackBy="y" xDistance={100} onMouseLeave={this.onMouseLeave} style={{marginTop:'35px'}}>
							<VerticalGridLines />
							<HorizontalGridLines />
							<XAxis />
							<YAxis left={30} hideLine />
							{DATA&&
								DATA.map((value,index)=>{
									return index===0?
									<VerticalBarSeries key={index} data={value} onNearestX={this.onNearestX} color={this.getColor(index)} barWidth={0.5} stroke="white"/>
									:
									<VerticalBarSeries key={index} data={value} color={this.getColor(index)} barWidth={0.5} stroke="white"/>
								})
							}
							{crosshairValues ? (
							<Hint value={crosshairValues} align={{horizontal: Hint.ALIGN.AUTO, vertical: Hint.ALIGN.TOP_EDGE}}>
								<div className="rv-hint__content">
									{
										`${crosshairValues.x}`
									}
									<br />
									{DATA&&
										DATA.map((value,index)=>{
											return index===0?
											`${ITEMS[index].title} - ${value[indx].y}` 
											:
											<Fragment key={index}>
												<br />
												{`${ITEMS[index].title} - ${value[indx].y}`}
											</Fragment>
										})
									}
								</div>
							</Hint>
							) : null}
						</FlexibleWidthXYPlot>
							:
							<div style={{padding:"20px 10px",color:"grey"}}>Произошла ошибка при загрузке графика</div>
						)}
					</div>
					<div className="chart-container">
						<div style={{textAlign:'center',marginTop:'20px'}}>Среднедневная сумма продаж</div>
						{isLoading[3] ? 
							<Searching />
							:(DATA4.length>0?
							<FlexibleWidthXYPlot xType="ordinal" xDistance={100} height={350} stackBy="y" onMouseLeave={this.onMouseLeave4} style={{marginTop:'35px'}}>
							<VerticalGridLines />
							<HorizontalGridLines />
							<XAxis/>
							<YAxis left={20} hideLine/>
							{DATA4&&
								DATA4.map((value,index)=>{
									return index===0?
									<VerticalBarSeries key={index} data={value} onNearestX={this.onNearestX4} color={this.getColor(index)} barWidth={0.5} stroke="white"/>
									:
									<VerticalBarSeries key={index} data={value} color={this.getColor(index)} barWidth={0.5} stroke="white"/>
								})
							}
							
							{crosshairValues4 ? (
							<Hint value={crosshairValues4} align={{horizontal: Hint.ALIGN.AUTO, vertical: Hint.ALIGN.TOP_EDGE}}>
								<div className="rv-hint__content">
									{
										`${crosshairValues4.x}`
									}
									<br />
									{DATA4&&
										DATA4.map((value,index)=>{
											return index===0?
											`${ITEMS4[index].title} - ${value[indx4].y}` 
											:
											<Fragment key={index}>
												<br />
										{`${ITEMS4[index].title} - ${value[indx4].y}`}
											</Fragment>
										})
									}
								</div>
							</Hint>
							) : null}
						</FlexibleWidthXYPlot>
							:
							<div style={{padding:"20px 10px",color:"grey"}}>Произошла ошибка при загрузке графика</div>
						)}
					</div>
				</div>
				<div style={{display:'flex'}}>
					<div className="chart-container">
						<div style={{textAlign:'center',marginTop:'20px'}}>Среднедневное количество чеков</div>
						{isLoading[2] ? 
							<Searching />
							:(DATA3.length>0?
							<FlexibleWidthXYPlot yPadding={10} xPadding={composNumber===1?0:10} height={350} onMouseLeave={this.onMouseLeave3} style={{marginTop:'35px'}}>
							<VerticalGridLines />
							<HorizontalGridLines />
							<XAxis tickFormat={v => thirdGraphXTitle[v]}/>
							<YAxis left={20} hideLine/>
							{crosshairValues3.length>0 ? (
								<Crosshair values={crosshairValues3}>
									<div className="rv-hint__content">
										{
											`${thirdGraphXTitle[crosshairValues3[0].x]}`
										}
										<br />
										{
											crosshairValues3.map((value,index)=>{
												return index===0?
												`${ITEMS3[index].title} - ${value.y}` 
												:
												<Fragment key={index}>
													<br />
													{`${ITEMS3[index].title} - ${value.y}`}
												</Fragment>
											})
										}									
									</div>
								</Crosshair>
							):null}
							{DATA3 && DATA3.map((value,idx)=> {
								return idx===0 ? 
								<LineMarkSeries data={value} 
									color={this.getColor(idx)}
									size={3}
									onNearestX={this.onNearestX3}
									curve={'curveMonotoneX'}
									key={idx}
								/>
								:
								<LineMarkSeries data={value}
									color={this.getColor(idx)}
									size={3}
									curve={'curveMonotoneX'}
									key={idx}
								/>
							})
							}
						</FlexibleWidthXYPlot>
							:
							<div style={{padding:"20px 10px",color:"grey"}}>Произошла ошибка при загрузке графика</div>
						)}
					</div>
					<div className="chart-container">					
						<div style={{textAlign:'center',marginTop:'20px'}}>Средний чек</div>
						{isLoading[1] ? 
							<Searching />
							:(DATA2.length>0?
							<FlexibleWidthXYPlot yPadding={10} xPadding={composNumber===1?0:10} height={350} onMouseLeave={this.onMouseLeave2} style={{marginTop:'35px'}}>
								<VerticalGridLines />
								<HorizontalGridLines />
								<XAxis tickFormat={v => secondGraphXTitle[v]}/>
								<YAxis left={20} hideLine/>
								{crosshairValues2.length>0 ? (
									<Crosshair values={crosshairValues2}>
										<div className="rv-hint__content">
											{
												`${secondGraphXTitle[crosshairValues2[0].x]}`
											}
											<br />
											{
												crosshairValues2.map((value,index)=>{
													return index===0?
													`${ITEMS2[index].title} - ${value.y}` 
													:
													<Fragment key={index}>
														<br />
														{`${ITEMS2[index].title} - ${value.y}`}
													</Fragment>
												})
											}									
										</div>
									</Crosshair>
								):null}
								{DATA2 && DATA2.map((value,idx)=> {
									return idx===0 ? 
									<LineMarkSeries data={value} 
										color={this.getColor(idx)}
										size={3}
										onNearestX={this.onNearestX2}
										curve={'curveMonotoneX'}
										key={idx}
									/>
									:
									<LineMarkSeries data={value}
										color={this.getColor(idx)}
										size={3}
										curve={'curveMonotoneX'}
										key={idx}
									/>
								})
								}
							</FlexibleWidthXYPlot>
							:
							<div style={{padding:"20px 10px",color:"grey"}}>Произошла ошибка при загрузке графика</div>
						)}
					</div>
				</div>
				<div style={{display:'flex'}}>
					<div className="chart-container">
						<div style={{textAlign:'center',marginTop:'20px'}}>Среднедневное количество чеков</div>
						{isLoading[4] ? 
							<Searching />
							:(DATA5.length>0?
							<FlexibleWidthXYPlot xType="ordinal" height={350} stackBy="y" xDistance={100} onMouseLeave={this.onMouseLeave5} style={{marginTop:'35px'}}>
							<VerticalGridLines />
							<HorizontalGridLines />
							<XAxis />
							<YAxis left={30} hideLine />
							{DATA5&&
								DATA5.map((value,index)=>{
									return index===0?
									<VerticalBarSeries key={index} data={value} onNearestX={this.onNearestX5} color={this.getColor(index)} barWidth={0.5} stroke="white"/>
									:
									<VerticalBarSeries key={index} data={value} color={this.getColor(index)} barWidth={0.5} stroke="white"/>
								})
							}
							{crosshairValues5 ? (
							<Hint value={crosshairValues5} align={{horizontal: Hint.ALIGN.AUTO, vertical: Hint.ALIGN.TOP_EDGE}}>
								<div className="rv-hint__content">
									{
										`${crosshairValues5.x}`
									}
									<br />
									{DATA5&&
										DATA5.map((value,index)=>{
											return index===0?
											`${ITEMS5[index].title} - ${value[indx5].y}` 
											:
											<Fragment key={index}>
												<br />
												{`${ITEMS5[index].title} - ${value[indx5].y}`}
											</Fragment>
										})
									}
								</div>
							</Hint>
							) : null}
						</FlexibleWidthXYPlot>
							:
							<div style={{padding:"20px 10px",color:"grey"}}>Произошла ошибка при загрузке графика</div>
						)}
					</div>
					<div className="chart-container">
						<div style={{textAlign:'center',marginTop:'20px'}}>Средний чек</div>
						{isLoading[5] ? 
							<Searching />
							:(DATA6.length>0?
								<FlexibleWidthXYPlot xType="ordinal" yPadding={10} xPadding={0} height={350} onMouseLeave={this.onMouseLeave6} style={{marginTop:'35px'}}>
							<VerticalGridLines />
							<HorizontalGridLines />
							<XAxis/>
							<YAxis left={20} hideLine/>
							{DATA6&&
								DATA6.map((value,index)=>{
									return index===0 ? 
									<LineMarkSeries data={value} 
									  color={this.getColor(index)}
									  size={3}
									  onNearestX={this.onNearestX6}
									  curve={'curveMonotoneX'}
									  key={index}
									/>
									:
									<LineMarkSeries data={value}
									  color={this.getColor(index)}
									  size={3}
									  curve={'curveMonotoneX'}
									  key={index}
									/>
								})
							}
							
							{crosshairValues6 ? (
							<Hint value={crosshairValues6} align={{horizontal: Hint.ALIGN.AUTO, vertical: Hint.ALIGN.TOP_EDGE}}>
								<div className="rv-hint__content">
									{
										`${crosshairValues6.x}`
									}
									<br />
									{DATA6&&
										DATA6.map((value,index)=>{
											return index===0?
											`${ITEMS6[index].title} - ${value[indx6].y}` 
											:
											<Fragment key={index}>
												<br />
										{`${ITEMS6[index].title} - ${value[indx6].y}`}
											</Fragment>
										})
									}
								</div>
							</Hint>
							) : null}
						</FlexibleWidthXYPlot>
							:
							<div style={{padding:"20px 10px",color:"grey"}}>Произошла ошибка при загрузке графика</div>
						)}
					</div>
				</div>
				<div style={{display:'flex'}}>
				<div className="chart-container">
					<div style={{textAlign:'center',marginTop:'20px'}}>Продажи за последние 2 недели</div>
						{isLoading[6] ? 
						<Searching />
						:(DATA7.length>0?
						<FlexibleWidthXYPlot xType="ordinal" xDistance={100} height={350} stackBy="y" onMouseLeave={this.onMouseLeave7} style={{marginTop:'35px'}}>
							<VerticalGridLines />
							<HorizontalGridLines />
							<XAxis tickFormat={v => seventhGraphXTitle[v]}/>
							<YAxis left={20} hideLine/>
							{DATA7&&
								DATA7.map((value,index)=>{
									return index===0?
									<VerticalBarSeries key={index} data={value} onNearestX={this.onNearestX7} color={this.getColor(index)} barWidth={0.5}/>
									:
									<VerticalBarSeries key={index} data={value} color={this.getColor(index)} barWidth={0.5}/>
								})
							}
							
							{crosshairValues7 ? (
							<Hint value={crosshairValues7} align={{horizontal: Hint.ALIGN.AUTO, vertical: Hint.ALIGN.TOP_EDGE}}>
								<div className="rv-hint__content">
									{
										`${seventhGraphFullXTitles[crosshairValues7.x]}`
									}
									<br />
									{DATA7&&
										DATA7.map((value,index)=>{
											return index===0?
											`${ITEMS7[index].title} - ${value[indx7].y}` 
											:
											<Fragment key={index}>
												<br />
										{`${ITEMS7[index].title} - ${value[indx7].y}`}
											</Fragment>
										})
									}
								</div>
							</Hint>
							) : null}
						</FlexibleWidthXYPlot>
						:
						<div style={{padding:"20px 10px",color:"grey"}}>Произошла ошибка при загрузке графика</div>
						)}
					</div>
					<div className="chart-container" style={{border:'0px'}}>
						<div style={{color:"blue", paddingBottom:"10px",paddingTop:"10px",paddingLeft:"10px"}}>Графики не включают в себя текущий день</div>
						<DiscreteColorLegend height={300} width={300} items={ITEMS3} colors={myColorArray}/>
					</div>
				</div>
			</div>
		);
	}
}

export default ChartsPage;