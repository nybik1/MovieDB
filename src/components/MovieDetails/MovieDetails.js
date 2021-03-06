import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getMovie } from '../../app/movies/actions';
import { Link } from 'react-router-dom';
import s from './style.module.scss';
import 'antd/dist/antd.css';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { Button, Modal } from 'antd';
import Reviews from './../Reviews';
import Similar from './../SimilarMovies';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import backBtn from './../../imgs/back.svg';
import cs from 'classnames';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';




class movieDetail extends Component {
    state = {
        images: [],
        cast: [],
        teaser: [],
        visible: false,
        isFavorite: false,
    }

    getMovieImg() {
        fetch(`https://api.themoviedb.org/3/movie/${this.props.match.params.id}/images?api_key=4fbb4691e328ec322d3358761a861113`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({ images: data.backdrops })
            })
    }

    getMovieCast() {
        fetch(`https://api.themoviedb.org/3/movie/${this.props.match.params.id}?api_key=4fbb4691e328ec322d3358761a861113&append_to_response=credits`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({ cast: data.credits.cast })
            })
    }

    getMovieTeaser() {
        fetch(`https://api.themoviedb.org/3/movie/${this.props.match.params.id}/videos?api_key=4fbb4691e328ec322d3358761a861113&language=en-US`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({ teaser: data.results.slice(0, 1) })
            })
    }


    toggleFavorites = (movie) => (e) => {
        const favorites = JSON.parse(window.localStorage.getItem('favorites'));
        const index = favorites.findIndex(item => item.id === this.props.movie.id);
        if (index !== -1) {
            favorites.splice(index, 1)
            this.setState({ isFavorite: false })
        }
        else {
            favorites.push(movie)
            this.setState({ isFavorite: true })
        };
        window.localStorage.setItem('favorites', JSON.stringify(favorites));
        this.forceUpdate();
    }

    // toggleReviewClass() {
    //     this.setState({ addClass: !this.state.addClass })
    // }

    toggleFullReview() {
        const review = this.reviewRef.current;
        review.addClass('full');
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    closeModal = e => {
        this.setState({
            visible: false,
        });

    };

    loadMovieData() {
        this.props.getMovie(this.props.match.params.id);
        this.getMovieImg()
        this.getMovieCast()
        this.getMovieTeaser()
    }

    componentDidMount() {
        this.loadMovieData()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.loadMovieData()
        }
    }





    render() {
        const { movie, loading, match: { params: { id: movieId } } } = this.props;
        const isMovieInFavorites = JSON.parse(window.localStorage.getItem('favorites')).find(item => item.id === movie.id)
        const favoriteBtnText = isMovieInFavorites ? 'Remove from favorites' : 'Add to favorites';
        const [image = {}] = this.state.images;
        console.log(movie.genres)
        const style = {
            fontSize: '150px',
        };
        const antIcon = <LoadingOutlined style={style} spin />;

        return (
            <div>
                {loading && <div className={s.spinner}><Spin indicator={antIcon} /></div>}
                {!loading &&
                    <div className={s.movie}>
                        <Link className={s.movie__btnBack} to='/'><img alt='btnBack' src={backBtn} /> </Link>
                        <div className={s.movie__wrapper_first} style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${image.file_path})` }}>
                            <div className={s.poster_btn_wrapper}>
                                <div className={s.movie__poster}>
                                    <LazyLoadImage src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='img' effect='blur'>
                                    </LazyLoadImage>
                                </div>
                                <div className={s.movie_action_wrapper}>
                                    <button onClick={this.toggleFavorites(movie)} className={cs(s.addFavorite, ({ [s.inFavorites]: !isMovieInFavorites }))}> {favoriteBtnText}</button>
                                    <div className={s.movie__trailer}>
                                        <Button type='primary' onClick={this.showModal}>Watch trailer</Button>
                                        {this.state.visible && this.state.teaser.map(item =>
                                            <Modal width='960px' footer={null} title={this.props.movie.original_title} visible={this.state.visible} onCancel={this.closeModal}>
                                                <iframe title='video' width='100%' height='480px'
                                                    src={`https://www.youtube.com/embed/${item.key}`}
                                                    frameborder="0"
                                                    allowfullscreen></iframe>
                                            </Modal>)}
                                    </div>
                                </div>
                            </div>
                            <div className={s.movie__info}>
                                <div className={s.movie__titleWrapper}>
                                    <h4 className={s.movie__title}>{movie.original_title}</h4>
                                    <div className={s.progressWwrapper}>
                                        <CircularProgressbar strokeWidth='5' value={movie.vote_average * 10} text={movie.vote_average}
                                            styles={buildStyles({
                                                textSize: '36px'
                                            })}></CircularProgressbar>
                                    </div>
                                </div>
                                <div className={s.movie__genres}>
                                    {movie.movie && movie.genres.map(item => <p className={s.movie__genre}>{item.name}</p>)}
                                </div>
                                <p>{movie.tagline}</p>
                                <div className={s.movie__overview}>
                                    <h4 className={s.overview__title}>Overview</h4>
                                    <p className={s.overview}>{movie.overview}</p>
                                </div>
                            </div>
                        </div>
                        <div className={s.movie__wrapper_second}>
                            <div className={s.movie__images}>
                                <h3 className={s.movie__images_title}>Movies media</h3>
                                <Carousel
                                    centered
                                    slidesPerPage={3}
                                    slidesPerScroll={2}
                                    infinite
                                    lazyLoad
                                    autoPlay={5000}
                                    animationSpeed={3000}>
                                    {this.state.images.map(item =>
                                        <img className={s.movie__image} key={movie.id} alt='movie img' src={`https://image.tmdb.org/t/p/w500/${item.file_path}`}></img>
                                    )}
                                </Carousel>
                            </div>
                            <div className={s.movie__cast}>
                                <h3 className={s.movie__cast_title}>Movies cast</h3>
                                <Carousel
                                    slidesPerPage={10}
                                    slidesPerScroll={5}
                                    infinite
                                    lazyLoad
                                    autoPlay={5000}
                                    animationSpeed={3000}>
                                    {this.state.cast.map(item =>
                                        <div key={item.id} className={s.movie__actor}>
                                            {item.profile_path && <img alt='actor_photo' src={`https://image.tmdb.org/t/p/w500/${item.profile_path}`} />}
                                            {!item.profile_path && <img src='https://via.placeholder.com/100x150' alt='noimg' />}
                                            <p className={s.actor__name}>{item.name}</p>
                                            <p className={s.actor__character}><strong>Character: </strong>{item.character}</p>
                                        </div>)}
                                </Carousel>
                            </div>
                            <div className={s.similar_review_wrapper}>
                                <Reviews movieId={movieId} />
                                <Similar movieId={movieId} />
                            </div>
                        </div >
                    </div>
                }
            </div >

        )
    }
}


export default connect(({ movies: { movie, loading } }) => ({
    movie: movie,
    loading,
}), { getMovie })(movieDetail);