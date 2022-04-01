import axios from "axios";
import React, { useEffect, useContext, useState } from "react";

import {Fraction} from 'fractional';
import { RecipeActionTypes, RecipeContext, IngredientObj } from "../contexts/recipe-context";
import { Icons } from "../assets/svg";
import LoaderUI from "./Loader-UI";

const RecipeView: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [showRecipe, setShowRecipe] = useState(false);
    const [isLiked,setIsLiked] = useState(false);
    const [serving, setServing] = useState(4);
    
    const { state, dispatch } = useContext(RecipeContext);

    const recipesArr = [...state.likedRecipes];
    const index = recipesArr.findIndex(rec => rec.id === state.recipe_id);

    useEffect(() => {
        const fetchRecipe = async (id: string) => {
            setIsLoading(true);
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${id}`);
            const { title ,image_url, source_url, publisher, ingredients } = res.data.recipe;

            dispatch({
                type: RecipeActionTypes.SET_RECIPE,
                payload: {
                    recipe: {
                        title,
                        ingredients: parseIngredients(ingredients),
                        publisher,
                        source_url,
                        image_url
                    }
                }
            });
            setShowRecipe(true);
            setIsLoading(false);
        };

        if(index === -1) {
            setIsLiked(false)
        } else {
            setIsLiked(true);
        }

        if(!(state.recipe_id === "")) {
            fetchRecipe(state.recipe_id);
        };

    }, [state.recipe_id, dispatch, index]);

    const parseIngredients = (ing: string[]) => {
        const unitsLong = ['tablespoons','tablespoon', 'ounces', 'ounce', 'teaspoons','teaspoon','cups','pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp','tsp','cup','pounds'];
        const units = [...unitsShort, 'kg','g'];
        
        const newIngredients = ing.map(el => {
            // 1. Uniform Units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });    
            // 2. Remove Parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g,' ');

            // 3. Parse Ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if(unitIndex > -1) {
                // There is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-','+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0],10)) {
                // There is NO unit, but 1st Element is Number
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });

        return newIngredients;
    }

    const calcTime = (): number => {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = state.recipe.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        return periods * 15;
    };

    const likeHandler = () => {
        // Like Functionality
        const likedRecipe = {
            id: state.recipe_id,
            title: state.recipe.title,
            img: state.recipe.image_url,
            author: state.recipe.publisher
        };

        if (index !== -1) {
            const filteredLikedRecipes = recipesArr.filter(rec => rec.id !== likedRecipe.id);
            dispatch({
            type: RecipeActionTypes.SET_LIKED_RECIPES,
            payload: {
                likedRecipes: filteredLikedRecipes
            }
            });
        } else {
            recipesArr.push(likedRecipe);
            dispatch({
                type: RecipeActionTypes.SET_LIKED_RECIPES,
                payload: {
                    likedRecipes: recipesArr
                }
            });
        }  
    };

    const formatCount = (count: number) => {
        if (count) {
            const newCount = Math.round(count * 10000) / 10000;
            const [int, dec] = newCount.toString().split('.').map(el => parseInt(el,10));
    
            if(!dec) return newCount;
    
            if(int===0) {
                const fr = new Fraction(newCount);
                return `${fr.numerator}/${fr.denominator}`;
            } else {
                const fr = new Fraction(newCount - int);
                return `${int} ${fr.numerator}/${fr.denominator}`;
            }
        }
        return '?';
    };


    const createIngredient = (ingredient: IngredientObj) => {
        return (
            <li className="recipe__item" key={Math.random()}>
                <svg className="recipe__icon">
                    <use href={`${Icons}#icon-check`}></use>
                </svg>
                <div className="recipe__count">{formatCount(ingredient.count)}</div>
                <div className="recipe__ingredient">
                    <span className="recipe__unit">{ingredient.unit}</span>
                    {ingredient.ingredient}
                </div>
            </li>
        );
    };

    const decBtnHandler = () => {
        const newIng = [...state.recipe.ingredients];
        const newServings = serving - 1;
        newIng.forEach(ing => {
            ing.count *= ( newServings / serving);
        });
        
        setServing(prevServing => prevServing - 1);
    }

    const incBtnHandler = () => {
        const newIng = [...state.recipe.ingredients];
        const newServings = serving + 1;
        newIng.forEach(ing => {
            ing.count *= ( newServings / serving);
        });
        
        setServing(prevServing => prevServing + 1);
    }


    return (
        <div className="recipe">
            {
                showRecipe ? 
                (
                    isLoading ? <LoaderUI /> :
                    <>
                        <figure className="recipe__fig">
                            <img src={state.recipe.image_url} alt={state.recipe.title} className="recipe__img" />
                            <h1 className="recipe__title">
                                <span>{state.recipe.title}</span>
                            </h1>
                        </figure>
                        <div className="recipe__details">
                        <div className="recipe__info">
                            <svg className="recipe__info-icon">
                                <use href={`${Icons}#icon-stopwatch`}></use>
                            </svg>
                            <span className="recipe__info-data recipe__info-data--minutes">{calcTime()}</span>
                            <span className="recipe__info-text"> minutes</span>
                        </div>
                        <div className="recipe__info">
                            <svg className="recipe__info-icon">
                                <use href={`${Icons}#icon-man`}></use>
                            </svg>
                            <span className="recipe__info-data recipe__info-data--people">{serving} </span>
                            <span className="recipe__info-text"> servings</span>
            
                            <div className="recipe__info-buttons">
                                <button className="btn-tiny btn-decrease" onClick={decBtnHandler}>
                                    <svg>
                                        <use href={`${Icons}#icon-circle-with-minus`}></use>
                                    </svg>
                                </button>
                                <button className="btn-tiny btn-increase" onClick={incBtnHandler}>
                                    <svg>
                                        <use href={`${Icons}#icon-circle-with-plus`}></use>
                                    </svg>
                                </button>
                            </div>
            
                        </div>
                        <button className="recipe__love" onClick={likeHandler}>
                            <svg className="header__likes">
                                <use href={`${Icons}#icon-heart${isLiked ? '' : '-outlined'}`}></use>
                            </svg>
                        </button>
                    </div>
                    <div className="recipe__ingredients">
                        <ul className="recipe__ingredient-list">
                            {state.recipe.ingredients.map(el => createIngredient(el))}
                        </ul>
                        <button className="btn-small recipe__btn recipe__btn--add">
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
                            <span className="recipe__by">{state.recipe.publisher}</span>. Please check out directions at their website.
                        </p>
                        <a className="btn-small recipe__btn" href={state.recipe.source_url} rel="noreferrer" target="_blank">
                            <span>Directions</span>
                            <svg className="search__icon">
                                <use href={`${Icons}#icon-triangle-right`}></use>
                            </svg>
                        </a>
                    </div>

                  </>
                ) : null
            }
        </div> 
    );
}   

export default RecipeView;