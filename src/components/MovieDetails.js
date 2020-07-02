import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getMovie } from './../app/movies/actions';
import { Link } from 'react-router-dom';
import './MovieDetails.css';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';


class movieDetail extends Component {
    state = {
        images: []
    }

    getMovieImg() {
        fetch(`https://api.themoviedb.org/3/movie/${this.props.match.params.id}/images?api_key=4fbb4691e328ec322d3358761a861113`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({ images: data.backdrops })
            })
    }

    componentDidMount() {
        this.props.getMovie(this.props.match.params.id);
        this.getMovieImg()

    }


    render() {
        const { movie } = this.props
        return (
            <div>
                <div className='movie'>
                    <div className='movie__poster'>
                        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='img'></img>
                    </div>
                    <div className='movie__wrapper'>
                        <Carousel
                            centered
                            slidesPerPage={3}
                            infinite
                            autoPlay={2000}
                            animationSpeed={1000}>
                            {this.state.images.map(item =>
                                <img className='movie__image' alt='movie img' src={`https://image.tmdb.org/t/p/w500/${item.file_path}`}></img>

                            )}
                        </Carousel>
                        <div className='movie__info'>
                            <h4 className="movie__title">{movie.original_title}</h4>
                            <p>{movie.overview}</p>
                            <button className='movie__btn-back'>
                                <Link to='/'>Back</Link>
                            </button>
                        </div>
                    </div>

                </div >
            </div >
        )
    }
}


export default connect(({ movies: { movie } }) => ({
    movie: movie,
}), { getMovie })(movieDetail);