import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { IoSearch } from 'react-icons/io5'
import MovieCard from '../components/MovieCard'
import SearchModal from '../components/SearchModal'
import tmdb_logo from '../images/tmdb.svg'
import { searchTMDB } from '../api'
import '../stylesheets/Search.scss'


class Search extends React.Component {

  state = {
    showModal: false,

    query: null,

    page: 1,
    lastPage: 1,

  	results: null,
    total_results: null
  }

  searchMovies = (page = 1, query = this.state.query) => {
    searchTMDB(page, query)
    .then(res => {
      this.setState({
        query: query,
        page: res.page,
        lastPage: res.total_pages,
        results: res.results,
        total_results: res.total_results
      })
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.searchMovies(1, event.target.query.value)
  }

  renderResults = ()=> {
  	const results = this.state.results
    const user = this.props.user

  	if(results === null)
  		return <div className="start-search">
        <div>powered by</div>
        <img src={tmdb_logo} draggable="false" alt="The Movie Database"></img>
      </div>
  	else if (results.length === 0)
  		return <div className="empty-search-text">Zero results found for "{this.state.query}"</div>
  	else
  		return (
        <Fragment>
    			<div className="search-results">
    				{ results.map(movie => {
              return (
                <div key={movie.id} onClick={()=> this.setState({ showModal: movie }) }>
                  <MovieCard
                    movie={movie} 
                    seen={user.completed.hasOwnProperty(movie.id)} 
                    backlogged={user.backlog.hasOwnProperty(movie.id)} 
                    favorited={user.favorites.hasOwnProperty(movie.id)}
                  />
                </div>
              )
            })}
  				</div>

          <button
            className="results-page-button red-btn"
            disabled={this.state.page === 1}
            onClick={()=> this.searchMovies(this.state.page - 1) }>
            Previous
          </button>

          <button
            className="results-page-button red-btn"
            disabled={this.state.page === this.state.lastPage}
            onClick={()=> this.searchMovies(this.state.page + 1) }>
            Next
          </button>

          <div className="page-text">
            Page {this.state.page} of {this.state.lastPage} ({this.state.total_results} results)
          </div>
        </Fragment>
			)
  }

  renderModal = ()=> {
    if (this.state.showModal) {
      return <SearchModal movie={this.state.showModal} closeModal={this.closeModal}/>
    }
    else
      return null
  }

  closeModal = ()=> {
    if (this.state.showModal)
      this.setState({ showModal: false })
  }

	render() {
	  return (
	   <div id="Search">
      { this.renderModal() }

	   	<form className="search-form" onSubmit={this.handleSubmit}>
	    	<input required className="search-input" name="query" type="search" placeholder="Search"/>
	    	<button className="search-button" type="submit"><IoSearch/></button>
	    </form>

	    { this.renderResults() }
	   </div>
	  )
	}
}

let mapStateToProps = state => ({ user: state.user })
export default connect(mapStateToProps)(Search)
