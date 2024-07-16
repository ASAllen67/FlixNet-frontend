import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { healthCheck, getUser } from './api'
import ReactLoading from 'react-loading'
import Login from './views/Login'
import Signup from './views/Signup'
import Navibar from './components/Navibar'
import Search from './views/Search'
import MovieTracker from './views/MovieTracker'
import './stylesheets/App.scss'

class App extends React.Component {

	state = {
		loading: true
	}

	componentDidMount() {
		if (this.props.loggedIn) {
			getUser()
			.then(res => {
				this.setState({ loading: false })
				const user = res.body.user
				if (user) this.props.dispatch({ type: "SET_USER", user })
				else this.props.dispatch({ type: "LOG_OUT" })
			})
			.catch(() => this.props.dispatch({ type: "LOG_OUT" }))
		}
		else {
			healthCheck()
			.then(() => this.setState({ loading: false }))
			.catch(() => setTimeout(() => window.location.reload(), 15000))
		}
	}

	loading = () => (
		<div className="loading">
			<ReactLoading type="bars" color="#E50A12" height="20%" width="20%" />
			<div>Waking up database</div>
		</div>
	)

	loggedInRoutes = ()=> (
		<div id="App">
			<Navibar/>
			<Switch>
				<Route exact path='/search' component={Search} />
				<Route exact path='/tracker' component={MovieTracker} />
				<Redirect to="/search" />
			</Switch>
		</div>
	)

	loggedOutRoutes = () => (
		<div id="App">
			<Switch>
				<Route exact path='/login' component={Login} />
				<Route exact path='/signup' component={Signup} />
				<Redirect to="/login" />
			</Switch>
		</div>
	)

	render() {
		if (this.state.loading) return this.loading()
		else if (this.props.loggedIn) return this.loggedInRoutes()
		else return this.loggedOutRoutes()
	}
}

let mapStateToProps = state => ({ loggedIn: state.session.loggedIn })
export default connect(mapStateToProps)(App)
