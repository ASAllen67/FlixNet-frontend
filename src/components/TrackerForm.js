import React from 'react'
import { connect } from 'react-redux'
import { IoChevronForwardOutline } from 'react-icons/io5'
import { createEntry } from '../api'
import '../stylesheets/TrackerForm.scss'


class TrackerForm extends React.Component {

	state = {
		hidden: true,
		status: "",
		hideSubmit: true
	}
	defaultState = this.state

	componentDidUpdate() {
	  this.bottom.scrollIntoView({ behavior: "smooth" })
	}

	toggleTrackerForm = ()=> {
		if (this.state.hidden)
			this.setState({ hidden: false })
		else
			this.setState(this.defaultState)
	}

	checkStatus = event => {
		const status = event.target
		const hideSubmit = !status.value
		this.setState({ status: status.value, hideSubmit })
	}

	handleSubmit = event => {
		event.preventDefault()

		const eType = this.state.status.toLowerCase()
		const movie = this.props.movie
		const entry = {
			title: movie.title,
			overview: movie.overview,
			genre_ids: movie.genre_ids,
			poster_path: movie.poster_path,
		}

		createEntry(eType, movie.id, entry)
		.then(res => {
			if (res.body.entry)
				this.props.dispatch({ type: "ADD_ENTRY", eType, id: movie.id, entry: res.body.entry })
		})
	}

	render() {
		return (
			<div className="tf-container">
				<button className={this.state.hidden ? "tf-toggle red-btn" : "tf-toggle inverted-red-btn"} onClick={this.toggleTrackerForm}>{this.state.hidden ? "Add to my Tracker" : "Cancel"}</button>

				<form className="tracker-form" hidden={this.state.hidden} onSubmit={this.handleSubmit}>
					<div className="tf-item-container">
						&nbsp;<IoChevronForwardOutline/>&nbsp;
						<select name="status" className="tf-select" value={this.state.status} onChange={this.checkStatus} required>
							<option disabled value="">Choose a status</option>
							<option value="completed">Completed</option>
							<option value="backlog">Plan to Watch</option>
						</select>
					</div>

					<div className="tf-item-container" hidden={this.state.hideSubmit}>
						&nbsp;<IoChevronForwardOutline/>&nbsp;
						<button className="tf-submit red-btn" type="submit">Add</button>
					</div>
				</form>

				<div ref={here => this.bottom = here}></div>
			</div>
		)
	}
}

export default connect()(TrackerForm)
