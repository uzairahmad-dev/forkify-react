import React, { useContext, useRef } from 'react';
import axios from 'axios';

import SearchForm from './SearchForm';
import LikesList from './LikesList';
import { RecipeContext } from '../contexts/recipe-context';
import { RecipeActionTypes } from '../utils/helper-types';
import {Logo} from '../assets/img/index';
import { Icons } from '../assets/svg';

const Header: React.FC = () => {

    const { state, dispatch } = useContext(RecipeContext);

    const enteredRecipe = useRef<HTMLInputElement>(null);

    const searchRecipeHandler = async (e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault(); 

        const text = enteredRecipe.current?.value;
        dispatch({
            type: RecipeActionTypes.SET_RECIPE_VALUE,
            payload: {
                recipeFor: text
            }
        });
        dispatch({
            type: RecipeActionTypes.SET_LOADING,
            payload: {
                loading: true
            }
        });

        try {   
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${text}`);
            const result = res.data.recipes;
            dispatch({
                type: RecipeActionTypes.SET_LOADING,
                payload: {
                    loading: false
                },
            });
            dispatch({
                type: RecipeActionTypes.SET_ERROR,
                payload: {
                    error: false
                },
            });
            if(result.length > 0) {
                dispatch({
                    type: RecipeActionTypes.SET_RECIPES,
                    payload: {
                        data: result
                    },
                });
            }
        } catch(error) {
            dispatch({
                type: RecipeActionTypes.SET_LOADING,
                payload: {
                    loading: false
                },
            });
            dispatch({
                type: RecipeActionTypes.SET_ERROR,
                payload: {
                    error: true
                },
            });
        } 
    };

    const renderLikes = () => {
        return state.likedRecipes.map(rec => {
            const likedObj = {
                id: rec.id,
                name: rec.title,
                author: rec.author,
                img: rec.img
            }

            return <LikesList key={rec.id} liked={likedObj} />
        });
    };

    return (
        <header className='header'>
            <img src={Logo} alt="Logo" className="header__logo" />
            <SearchForm inpRecipeRef={enteredRecipe} recipeSubmitHandler={searchRecipeHandler} />
            <div className="likes">
                {
                    state.likedRecipes.length > 0 ?
                    <>
                        <div className="likes__field">
                            <svg className="likes__icon">
                                <use href={`${Icons}#icon-heart`}></use>
                            </svg>
                        </div>
                        <div className="likes__panel">
                            <ul className="likes__list">
                                {renderLikes()}
                            </ul>
                        </div>
                    </>
                    : null
                }
            </div>
        </header>
    );
}

export default Header;