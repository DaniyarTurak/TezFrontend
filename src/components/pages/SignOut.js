import React, { Component } from 'react';
import Axios from 'axios';

class Signout extends Component {
	componentDidMount() {
		localStorage.clear();
		sessionStorage.clear();
		delete Axios.defaults.headers.common['Authorization'];
		this.props.history.push({
			pathname: '/',
			state: { signOut: true }
		});
	};

	render() {
		return (
			<div></div>
		)
	}
}

export default Signout;