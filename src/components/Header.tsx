import React, { useContext, useRef } from 'react';
import axios from 'axios';

import SearchForm from './SearchForm';
import { RecipeContext, RecipeActionTypes } from '../contexts/recipe-context';
import {Logo} from '../assets/img/index';

const Header: React.FC = () => {

    const { dispatch } = useContext(RecipeContext);

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

    return (
        <header className='header'>
            <img src={Logo} alt="Logo" className="header__logo" />
            <SearchForm inpRecipeRef={enteredRecipe} recipeSubmitHandler={searchRecipeHandler} />
            {/* <Likes /> */}
        </header>
    );
}

export default Header;