import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import NodeRSA from 'node-rsa'
import logo from '../images/logo.png'
import { public_key } from '../constants'
import { createUser } from '../api'
import '../stylesheets/prelogin.scss'


class Signup extends React.Component {

	state = {
		errors: null
	}

	handleSignup = event => {
		event.preventDefault()

		const form = event.target
		const lock = new NodeRSA(public_key)
		const credentials = {
			username: lock.encrypt(form.username.value, 'base64'),
			password: lock.encrypt(form.password.value, 'base64'),
			confirm_password: lock.encrypt(form.confirm_password.value, 'base64'),
		}

		createUser(credentials)
		.end((_, res) => {
			const {errors, token, user} = res.body
			if (errors) {
				form.password.value = ""
				form.confirm_password.value = ""
				this.setState({ errors: errors })
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
			<div id="Signup" className="pl-page">
				<img className="pl-logo" src={logo} draggable="false" alt="Film Stash" />

				<div className="pl-form-container">
					<h1 className="pl-heading">Sign Up</h1>

					{ this.state.errors && this.state.errors.map((error, index) => <p className="signup-error" key={index}>{error}</p>)}

					<form className="pl-form" onSubmit={this.handleSignup}>
						<input className="pl-input top" required type="text" name="username" placeholder="Username" /><br/>
						<input className="pl-input" required type="password" name="password" placeholder="Password" /><br/>
						<input className="pl-input" required type="password" name="confirm_password" placeholder="Confirm password" /><br/>
						<button className="pl-button red-btn" type="submit">Sign Up</button>
					</form>

					<Link to="/login" className="pl-redirect">Already have an account?</Link>
				</div>
			</div>
		)
	}
}

export default connect()(Signup)
