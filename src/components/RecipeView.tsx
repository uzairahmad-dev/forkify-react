import axios from "axios";
import React, { useEffect, useContext, useState } from "react";

import {Fraction} from 'fractional';
import { RecipeActionTypes, RecipeContext } from "../contexts/recipe-context";
import { Icons } from "../assets/svg";
import LoaderUI from "./Loader-UI";

const RecipeView: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [showRecipe, setShowRecipe] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    
    const { state, dispatch } = useContext(RecipeContext);

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
                        ingredients,
                        publisher,
                        source_url,
                        image_url
                    }
                }
            });
            setShowRecipe(true);
            setIsLoading(false);
        };
        
        if(!(state.recipe_id === "")) {
            fetchRecipe(state.recipe_id);
        }  

        console.log('UseEffect....');

    }, [state.recipe_id, dispatch]);

    const calcTime = (): number => {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = state.recipe.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        return periods * 15;
    };

    // const formatCount = count => {
    //     if (count) {
    //         const newCount = Math.round(count * 10000) / 10000;
    //         const [int, dec] = newCount.toString().split('.').map(el => parseInt(el,10));
    
    //         if(!dec) return newCount;
    
    //         if(int===0) {
    //             const fr = new Fraction(newCount);
    //             return `${fr.numerator}/${fr.denominator}`;
    //         } else {
    //             const fr = new Fraction(newCount - int);
    //             return `${int} ${fr.numerator}/${fr.denominator}`;
    //         }
    //     }
    //     return '?';
    // };

    // const createIngredient = (ingredient: string[]) => {
    //     return (
    //         <li className="recipe__item">
    //             <svg className="recipe__icon">
    //                 <use href={`${Icons}#icon-check`}></use>
    //             </svg>
    //             <div className="recipe__count">5/ </div>
    //             <div className="recipe__ingredient">
    //                 <span className="recipe__unit">5/ </span>
    //                 {/* ${ingredient.ingredient} */}
    //                 /unknown
    //             </div>
    //         </li>
    //     );
    // }

    const likeHandler = () => {

        const likedRecipe = {
            id: state.recipe_id,
            title: state.recipe.title
        }

        const filteredLikedRecipes = state.likedRecipes.filter(recipe => {
            return recipe.id !== likedRecipe.id
        });

        if (filteredLikedRecipes.length > 0) {
            dispatch({
            type: RecipeActionTypes.SET_LIKED_RECIPES,
            payload: {
                likedRecipes: filteredLikedRecipes
            }
            });
        } else {
            const newLikedRecipes = [...state.likedRecipes, likedRecipe];
            dispatch({
                type: RecipeActionTypes.SET_LIKED_RECIPES,
                payload: {
                    likedRecipes: newLikedRecipes
                }
                });
        }
        
    };

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
                            <span className="recipe__info-data recipe__info-data--people">4 </span>
                            <span className="recipe__info-text"> servings</span>
            
                            <div className="recipe__info-buttons">
                                <button className="btn-tiny btn-decrease">
                                    <svg>
                                        <use href={`${Icons}#icon-circle-with-minus`}></use>
                                    </svg>
                                </button>
                                <button className="btn-tiny btn-increase">
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
                  </>
                ) : null
            }

        {/* <div className="recipe__ingredients">
            <ul className="recipe__ingredient-list">
                ${state.recipe.ingredients.map(el => createIngredient(el)).join('')}
            </ul>

            <button className="btn-small recipe__btn recipe__btn--add">
                <svg className="search__icon">
                    <use href="{Icons}#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div className="recipe__directions">
            <h2 className="heading-2">How to cook it</h2>
            <p className="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span className="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a className="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg className="search__icon">
                    <use href="{Icons}#icon-triangle-right"></use>
                </svg>

            </a>
        </div> */}
        </div> 
    );
}   

export default RecipeView;