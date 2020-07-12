import React, { useState, useEffect } from 'react';
import cs from 'classnames';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import s from './style.module.scss';

const ReviewItem = ({ item }) => {
    const [isExtended, setExtended] = useState(false);
    return (
        <div className={cs(s.review, { [s.full]: isExtended })}>
            <h4 className={s.movie__reviewAuthor}>Review by: {item.author}</h4>
            <Button type='primary' className={s.movie__btnShowFull} onClick={() => setExtended(true)}>Show full</Button>
            <p className={s.movie__reviewText}>{item.content}</p>
        </div>
    );
}

export default function Reviews({ movieId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=4fbb4691e328ec322d3358761a861113`)
            .then((res) => res.json())
            .then((data) => {
                setReviews(data.results)
            })
    }, []);

    return (
        <div className={s.movie__reviews}>
            <h3 className={s.reviews__title}>Reviews</h3>
            <div className={s.movie__reviewWrapper}>
                {reviews.map(item => <ReviewItem item={item} />)}
            </div>
        </div>
    )
}