import React from 'react'
import { connect } from 'react-redux'
import MovieTable from '../components/MovieTable'
import '../stylesheets/MovieTracker.scss'

class MovieTracker extends React.Component {

	state = {
		status: "completed"
	}

	getHeader = ()=> {
		let message, grammar
		let count = Object.keys(this.props.user[this.state.status]).length

		if (count === 1) {
			count += " movie"
			grammar = "is"
		}
		else {
			count += " movies"
			grammar = "are"
		}

		switch(this.state.status) {
			case "backlog":
				message = `There ${grammar} ${count} in your Backlog`
			break;

			case "favorites": 
				message = `You have favorited ${count}`
			break;

			default:
				message = `You have seen ${count}`
			break;
		}

		return <div className="mt-heading">{message}</div>
	}

	getOptions = ()=> {
		const defaultClass = "mt-status-item"
		const activeClass = defaultClass + " mt-active-item"
		const entry_types = [
			{
				name: "Completed",
				status: "completed",
			},
			{
				name: "Backlog",
				status: "backlog",
			},
			{
				name: "Favorites",
				status: "favorites",
			}
		]

		return (
			<div className="mt-status-options">
			{ entry_types.map(type =>
					<div key={type.name} className={this.state.status === type.status ? activeClass : defaultClass} onClick={()=> this.setState({ status: type.status }) }>
						{type.name}
						<span className="mt-bottom"></span>
					</div>
			)}
			</div>
		)
	}

	getTable = ()=> {
		const entries = this.props.user[this.state.status]
		if (Object.keys(entries).length === 0)
			return null
		else
			return <MovieTable type={this.state.status}/>
	}

	render() {
		return (
			<div id="MovieTracker">
				{ this.getOptions() }
				{ this.getHeader() }
				{ this.getTable() }
			</div>
		)
	}
}

let mapStateToProps = state => ({ user: state.user })
export default connect(mapStateToProps)(MovieTracker)
