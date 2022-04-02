import React, { useEffect, useContext, useState } from "react";
import axios from "axios";

import { RecipeContext } from "../contexts/recipe-context";
import { RecipeActionTypes } from '../utils/helper-types';
import RecipeDetails from "./RecipeDetails";
import RecipeIngredients from "./RecipeIngredients";
import LoaderUI from "./Loader-UI";
import { parseIngredients, createNewIngredients } from '../utils/helper-functions';

const RecipeView: React.FC = () => {

    //* Local Component Initial State
    const [isLoading, setIsLoading] = useState(false);
    const [showRecipe, setShowRecipe] = useState(false);
    const [isLiked,setIsLiked] = useState(false);
    const [serving, setServing] = useState(4);
    
    const { state, dispatch } = useContext(RecipeContext);

    //* Global Variables
    const LIKED_RECIPES = [...state.likedRecipes];
    const INDEX = LIKED_RECIPES.findIndex(rec => rec.id === state.recipe_id);

    useEffect(() => {
        //* Fetching Recipe by Id
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
            setServing(4);
            setIsLoading(false);
        };

        //* Checking if current recipe was liked or not.
        if(INDEX === -1) {
            setIsLiked(false)
        } else {
            setIsLiked(true);
        }

        //* Checking for is there any current recipe.
        if(!(state.recipe_id === "")) {
            fetchRecipe(state.recipe_id);
        };

    }, [state.recipe_id, dispatch, INDEX]); 

    const likeHandler = () => {
        //* Like Functionality
        const likedRecipe = {
            id: state.recipe_id,
            title: state.recipe.title,
            img: state.recipe.image_url,
            author: state.recipe.publisher
        };
        if (INDEX !== -1) {
            const filteredLikedRecipes = LIKED_RECIPES.filter(rec => rec.id !== likedRecipe.id);
            dispatch({
            type: RecipeActionTypes.SET_LIKED_RECIPES,
            payload: {
                likedRecipes: filteredLikedRecipes
            }
            });
        } else {
            LIKED_RECIPES.push(likedRecipe);
            dispatch({
                type: RecipeActionTypes.SET_LIKED_RECIPES,
                payload: {
                    likedRecipes: LIKED_RECIPES
                }
            });
        }  
    };

    const decBtnHandler = () => { 
        const newIngredients = createNewIngredients(state.recipe.ingredients, 'dec', serving);
        dispatch({
            type: RecipeActionTypes.SET_RECIPE,
            payload: {
                recipe: {
                    ...state.recipe,
                    ingredients: newIngredients
                }
            }
        });
        setServing(prevServing => prevServing - 1);
    };

    const incBtnHandler = () => {
        const newIngredients = createNewIngredients(state.recipe.ingredients, 'inc', serving);
        dispatch({
            type: RecipeActionTypes.SET_RECIPE,
            payload: {
                recipe: {
                    ...state.recipe,
                    ingredients: newIngredients
                }
            }
        });
        setServing(prevServing => prevServing + 1);
    };

    const shoppingListHandler = () => {
        const shoppingList = [...state.recipe.ingredients,...state.shoppingList];
        dispatch({
            type: RecipeActionTypes.SET_SHOPPING_LIST,
            payload: {
                shoppingList
            }
        });
    };

    return (
        <div className="recipe">
            {
                showRecipe ? 
                (
                    isLoading ? <LoaderUI /> :
                    <>
                        <RecipeDetails 
                            recipe={state.recipe} 
                            length={state.recipe.ingredients.length} 
                            serving={serving}
                            decBtnHandler={decBtnHandler}
                            incBtnHandler={incBtnHandler}
                            likeHandler={likeHandler}
                            isLiked={isLiked}
                        />
                        <RecipeIngredients 
                            ingredients={state.recipe.ingredients}
                            shoppingListHandler={shoppingListHandler}
                            publisher={state.recipe.publisher}
                            url={state.recipe.source_url}
                        />

                  </>
                ) : null
            }
        </div> 
    );
}   

export default RecipeView;