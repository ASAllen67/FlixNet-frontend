import React from 'react'
import { connect } from 'react-redux'
import { IoHeart, IoCheckmarkCircleOutline, IoHeartOutline, IoCloseCircleOutline } from 'react-icons/io5'
import { createEntry, deleteEntry } from '../api'
import { makePosterSrc } from '../library'


class MovieTable extends React.Component {

	favoriteEntry = (id, entry) => {
		createEntry('favorites', id, entry)
		.then(() => {
			this.props.dispatch({ type: 'ADD_ENTRY', eType: 'favorites', id, entry })
		})
	}

	completeEntry = (id, entry) => {
		createEntry('completed', id, entry)
		.then(() => {
			this.props.dispatch({ type: 'DEL_ENTRY', eType: 'backlog', id })
			this.props.dispatch({ type: 'ADD_ENTRY', eType: 'completed', id, entry: entry })
		})
	}

	destroyEntry = (type, id) => {
		deleteEntry(type, id)
		.then(() => {
			this.props.dispatch({ type: 'DEL_ENTRY', eType: type, id })
			if (type === 'completed')
				this.props.dispatch({ type: 'DEL_ENTRY', eType: 'favorites', id })
		})
	}

	makeActionTd = (id, entry) => {
		if (this.viewing('backlog')) {
			return <td><IoCheckmarkCircleOutline className='mt-check' onClick={()=> this.completeEntry(id, entry)}/></td>
		} else if (this.viewing('completed')) {
			if (this.props.user.favorites.hasOwnProperty(id)) {
				return <td><IoHeart className="mt-heart"/></td>
			} else {
				return <td><IoHeartOutline className="mt-heart-click" onClick={()=> this.favoriteEntry(id, entry)}/></td>
			}
		}
	}

	viewing = type => {
		return this.props.type === type
	}

	render() {
		const entries = this.props.user[this.props.type]
		return (
			<table className='mt-table table table-dark'>
				<thead>
					<tr className='no-wrap'>
						<th>#</th>
						<th>Poster</th>
						<th>Title</th>
						<th className='mt-overview'>Overview</th>
						{this.viewing('backlog') && <th>Mark Completed</th>}
						{this.viewing('completed') && <th>Add to Favorites</th>}
						<th>Delete Entry</th>
					</tr>
				</thead>
				<tbody>
					{Object.keys(entries).map((id, index) => {
						const entry = entries[id]
						const titleClass = `mt-table-title ${entry.title.length < 60 ? 'no-wrap' : null}`
						return (
							<tr key={index}>
								<td>{index+1}</td>
								<td><img className='mt-poster' src={makePosterSrc(entry.poster_path, 'w154')} alt='movie-poster' draggable='false'/></td>
								<td className={titleClass}>{entry.title}</td>
								<td className='mt-overview'>{entry.overview}</td>
								{this.makeActionTd(id, entry)}
								<td><IoCloseCircleOutline className='mt-delete' onClick={()=> this.destroyEntry(this.props.type, id)}/></td>
							</tr>
						)
					})}
				</tbody>
			</table>
		)
	}
}

const mapStateToProps = state => ({ user: state.user })
export default connect(mapStateToProps)(MovieTable)
