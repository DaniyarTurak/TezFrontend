import React, { Component } from 'react';

class PleaseWait extends Component {
	state = {
		pleaseWait: 'Пожалуйста подождите'
	};

	render() {
		const { pleaseWait } = this.state;
		return (
			<div className="row mt-10 text-center">
				<div className="col-md-12 not-found-text loading-dots">
					{pleaseWait} <span>.</span><span>.</span><span>.</span>
				</div>
			</div>
		);
	}
}

export default PleaseWait;