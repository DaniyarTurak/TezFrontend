import React, { Component } from 'react';

class NotFoundPage extends Component {
	state = {}
	render() {
		return (
			<div className="not-found-text">
				<center>
					<h1 style={{fontSize: '20em'}}>404</h1>
					<h2>Запрашиваемая страница не найдена</h2>
				</center>
			</div>
		);
	}
}

export default NotFoundPage;