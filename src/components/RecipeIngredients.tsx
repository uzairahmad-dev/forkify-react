import React from 'react';

import { IngredientObj } from '../utils/helper-types';
import { Icons } from '../assets/svg';
import { createIngredient } from '../utils/helper-functions';

interface IngredientsProps {
    ingredients: IngredientObj[];
    shoppingListHandler: () => void;
    publisher: string;
    url: string;
};


const RecipeIngredients: React.FC<IngredientsProps> = (props) => {
    return (
        <>
            <div className="recipe__ingredients">
                <ul className="recipe__ingredient-list">
                    {props.ingredients.map(el => createIngredient(el))}
                </ul>
                <button className="btn-small recipe__btn recipe__btn--add" onClick={props.shoppingListHandler}>
                    <svg className="search__icon">
                        <use href={`${Icons}#icon-shopping-cart`}></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>
            <div className="recipe__directions">
                <h2 className="heading-2">How to cook it</h2>
                <p className="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span className="recipe__by">{props.publisher}</span>. Please check out directions at their website.
                </p>
                <a className="btn-small recipe__btn" href={props.url} rel="noreferrer" target="_blank">
                    <span>Directions</span>
                    <svg className="search__icon">
                        <use href={`${Icons}#icon-triangle-right`}></use>
                    </svg>
                </a>
            </div>
        </>
    );
};

export default RecipeIngredients;