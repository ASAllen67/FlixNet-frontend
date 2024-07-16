import React from 'react'
import ReactTooltip from 'react-tooltip'
import { IoEye, IoHeart, IoList } from 'react-icons/io5'
import { makePosterSrc } from '../library'

export default function MovieCard (props) {
	return (
		<div className="movie-card">
			<div className="mc-status">
				{ props.seen && !props.favorited && <span data-tip="You've seen this movie"><IoEye className="mc-svg svg-align"/></span> }
				{ props.backlogged && <span data-tip="This movie is in your Backlog"><IoList className="mc-svg svg-align"/></span> }
				{ props.favorited && <span data-tip="Favorited"><IoHeart className="mc-svg svg-align"/></span> }
				<ReactTooltip/>
			</div>
			<img className="mc-poster" src={makePosterSrc(props.movie.poster_path, 'w342')} alt="movie-poster" draggable="false"/>
			<div className="mc-title">{props.movie.title}</div>
		</div>
	)
}