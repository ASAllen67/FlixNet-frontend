import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import NodeRSA from 'node-rsa'
import logo from '../images/logo.png'
import { public_key } from '../constants'
import { createSession } from '../api'
import '../stylesheets/prelogin.scss'


class Login extends React.Component {

	state = {
		error: null
	}

	handleLogin = event => {
		event.preventDefault()
		
		const form = event.target
		const key = new NodeRSA(public_key)
		const credentials = {
			username: key.encrypt(form.username.value, 'base64'),
			password: key.encrypt(form.password.value, 'base64')
		}

		createSession(credentials)
		.end((_, res) => {
			const {error, token, user} = res.body
			if (error) {
				form.password.value = ""
				this.setState({ error: error })
			}
			else if (token) {
				localStorage.setItem("token", token)
				this.props.dispatch({ type: "LOG_IN" })
				this.props.dispatch({ type: "SET_USER", user: user })
			}
		})
	}

	render() {
		return (
			<div id="Login" className="pl-page">
				<img className="pl-logo" src={logo} draggable="false" alt="Film Stash" />

				<div className="pl-form-container">
					<h1 className="pl-heading">Log In</h1>

					{ this.state.error && <p className="login-error">{this.state.error}</p> }

					<form className="pl-form" onSubmit={this.handleLogin}>
						<input className="pl-input top" required type="text" name="username" placeholder="Username" /><br/>
						<input className="pl-input" required type="password" name="password" placeholder="Password" />
						<button className="pl-button red-btn" type="submit">Log In</button>
					</form>

					<Link to="/signup" className="pl-redirect">Don't have an account yet?</Link>
				</div>
			</div>
		)
	}
}

export default connect()(Login)
