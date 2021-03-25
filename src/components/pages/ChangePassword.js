import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { InputField } from '../fields';
import { RequiredField, matchPasswords, passwordLength } from '../../validation';

import Alert from 'react-s-alert';
import Axios from 'axios';
// import Axios from 'axios';

class ChangePassword extends Component {
	state = {
		label: {
			currentPass: 'Текущий пароль',
			newPass: 'Новый пароль',
			confirmNewPass: 'Подтвердите новый пароль',
			placeholder: {
				currentPass: 'Введите текущий пароль',
				newPass: '6 и более символов',
				confirmNewPass: 'Введите новый пароль еще раз',
			},
			buttonLabel: {
				confirm: 'Сменить пароль'
			}
		},
		alert: {
			raiseError: 'Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже'
		}
	};

	handleSubmit = (data) => {
		if (data.currentPass === data.user_password) {
			Alert.warning('Новый пароль не должен совпадать с текущим паролем', {
				position: 'top-right',
				effect: 'bouncyflip',
				timeout: 3000
			});

			return;
		};

		this.submit(data);
	};

	submit = (data) => {
		Axios.post('/api/erpuser/changepass', data)
			.then(() => {
				this.props.history.push({
					pathname: '/usercabinet',
					state: {
						changepass: true
					}
				});
			})
			.catch((err) => {
				Alert.error(err.response.data.code === 'internal_error' ? this.state.alert.raiseError : err.response.data.text, {
					position: 'top-right',
					effect: 'bouncyflip',
					timeout: 2000
				});
			})
	};

	render() {
		const { handleSubmit } = this.props;
		const { label } = this.state;
		return (
			<form onSubmit={handleSubmit(this.handleSubmit)}>
				<div className="change-password">

					<Alert stack={{ limit: 1 }} offset={10} />

					<div className="row">
						<div className="col-md-12">
							<label htmlFor="">{label.currentPass} :</label>
							<Field
								name="currentPass"
								component={InputField}
								type="password"
								className="form-control"
								placeholder={label.placeholder.currentPass}
								validate={[RequiredField]}
							/>
						</div>
					</div>
					<div className="row mt-10">
						<div className="col-md-12">
							<label htmlFor="">{label.newPass} :</label>
							<Field
								name="user_password"
								component={InputField}
								type="password"
								className="form-control"
								placeholder={label.placeholder.newPass}
								validate={[RequiredField, passwordLength]}
							/>
						</div>
					</div>
					<div className="row mt-10">
						<div className="col-md-12">
							<label htmlFor="">{label.confirmNewPass} :</label>
							<Field
								name="confirmNewPass"
								component={InputField}
								type="password"
								className="form-control"
								placeholder={label.placeholder.confirmNewPass}
								validate={[RequiredField, matchPasswords]}
							/>
						</div>
					</div>

					<div className="row mt-10 ">
						<div className="col-md-12">
							<button type="submit" className="btn btn-success btn-block">
								{label.buttonLabel.confirm}
							</button>
						</div>
					</div>
				</div>
			</form >
		);
	}
}

ChangePassword = reduxForm({
	form: 'ChangePasswordForm'
})(ChangePassword);

export default ChangePassword;