import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import TrackerForm from './TrackerForm'
import { IoCheckmark, IoCloseCircleOutline } from 'react-icons/io5'
import { tmdbGenres, months } from '../constants'
import '../stylesheets/SearchModal.scss'

class SearchModal extends React.Component {

	componentDidMount() {
		document.body.style.overflow = "hidden"   
	}

	componentWillUnmount() {
		document.body.style.overflow = "unset"
	}

	showForm = () => {
		const movie = this.props.movie
		if (this.props.user.completed.hasOwnProperty(movie.id))
			return <div class="mm-text">
				You've seen this movie.
				<div><IoCheckmark className="svg-align green"/></div>
			</div>

		if (this.props.user.backlog.hasOwnProperty(movie.id))
			return <div class="mm-text">This movie is in your backlog.</div>

		else
			return <TrackerForm movie={movie}/>
	}

	render() {
		const movie = this.props.movie
		let release_date = null
		let genres = null
		let overview = null

		if (movie.release_date) {
			let dateArr = movie.release_date.split('-')
			release_date =
			<h5 className="mm-h5">
				{`Released on ${months[parseInt(dateArr[1])-1]} ${dateArr[2]}, ${dateArr[0]}`}
			</h5>
		}

		if (movie.genre_ids.length) {
			genres =
			<div className='mm-genres'>
				{ movie.genre_ids.map(g => <div className='red-tag'>{tmdbGenres[g]}</div>) }
			</div>
		}

		if (movie.overview) {
			overview =
			<Fragment>
				<br/>
				<div className="mm-overview-container">
					<h5 className="mm-overview-label">Overview</h5>
					<p className="mm-overview-text">"{movie.overview}"</p>
				</div>
			</Fragment>
		}

		return (
			<Modal className="movie-modal" isOpen={true}>
				<div className="mm-close-div"><IoCloseCircleOutline className="mm-close" onClick={this.props.closeModal}/></div>
				<h1 className="mm-h1">{movie.title}</h1>
				{ release_date }
				{    genres    }
				{   overview   }
				<br/>
				{ this.showForm() }
			</Modal>
		)
	}
}

let mapStateToProps = state => ({ user: state.user })
export default connect(mapStateToProps)(SearchModal)
