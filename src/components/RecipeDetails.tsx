import React from 'react';

import { RecipeSingle } from '../utils/helper-types';
import { calcTime } from '../utils/helper-functions';
import { Icons } from '../assets/svg';

interface DetailsProps {
    recipe: RecipeSingle;
    length: number;
    serving: number;
    decBtnHandler: () => void;
    incBtnHandler: () => void;
    likeHandler: () => void;
    isLiked: Boolean;
};

const RecipeDetails:React.FC<DetailsProps> = (props) => {
    return (
        <>
            <figure className="recipe__fig">
                <img src={props.recipe.image_url} alt={props.recipe.title} className="recipe__img" />
                <h1 className="recipe__title">
                    <span>{props.recipe.title}</span>
                </h1>
            </figure>
            <div className="recipe__details">
                <div className="recipe__info">
                    <svg className="recipe__info-icon">
                        <use href={`${Icons}#icon-stopwatch`}></use>
                    </svg>
                    <span className="recipe__info-data recipe__info-data--minutes">{calcTime(props.length)}</span>
                    <span className="recipe__info-text"> minutes</span>
                </div>
                <div className="recipe__info">
                    <svg className="recipe__info-icon">
                        <use href={`${Icons}#icon-man`}></use>
                    </svg>
                    <span className="recipe__info-data recipe__info-data--people">{props.serving} </span>
                    <span className="recipe__info-text"> servings</span>
                    <div className="recipe__info-buttons">
                        <button className="btn-tiny btn-decrease" onClick={props.decBtnHandler}>
                            <svg>
                                <use href={`${Icons}#icon-circle-with-minus`}></use>
                            </svg>
                        </button>
                        <button className="btn-tiny btn-increase" onClick={props.incBtnHandler}>
                            <svg>
                                <use href={`${Icons}#icon-circle-with-plus`}></use>
                            </svg>
                        </button>
                    </div>
                </div>
                <button className="recipe__love" onClick={props.likeHandler}>
                    <svg className="header__likes">
                        <use href={`${Icons}#icon-heart${props.isLiked ? '' : '-outlined'}`}></use>
                    </svg>
                </button>
            </div>
        </>
    );  
};

export default RecipeDetails;