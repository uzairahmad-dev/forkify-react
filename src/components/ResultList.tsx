import React, {useContext, useState} from "react";

import { RecipeContext } from '../contexts/recipe-context'
import { limitRecipeTitle } from '../utils/helper-functions';
import { Icons } from "../assets/svg";
import LoaderUI from './Loader-UI';

const ResultList: React.FC = () => {

    const { state } = useContext(RecipeContext);
    const [page, setPage] = useState(1);
    
    const resPerPage = 10;

    const renderRecipes = () => {
        const start = (page - 1) * resPerPage;
        const end = page * resPerPage;
        return state.data.slice(start,end).map(recipe => {
            return (
                <li key={recipe.recipe_id}>
                    <a className="results__link" href={recipe.recipe_id}>
                        <figure className="results__fig">
                            <img src={recipe.image_url} alt={recipe.title} />
                        </figure>
                        <div className="results__data">
                            <h4 className="results__name">{limitRecipeTitle(recipe.title)}</h4>
                            <p className="results__author">{recipe.publisher}</p>
                        </div>
                    </a>
                </li>
            );
        })
    };

    const renderButtons = (page: number, numRes: number, resPerPage: number) => {
        const pages = Math.ceil(numRes/resPerPage);
        if(page === 1 && pages > 1) {
            // Only Button to go To Next Page
            return createButton(page, 'next');   
        } else if(page < pages) {
            // Both Buttons
            return ( 
                <>
                    { createButton(page, 'prev') }
                    { createButton(page, 'next') }
                </>
            );
        } else if(page === pages && pages > 1) {
            // Only Button to go To Previous Page
            return createButton(page, 'prev');
        };

    };  

    const createButton = (page: number, type: string) => {
        const pageHandler = (e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();

            if(type === 'next') {
                setPage(prevPage => prevPage + 1);
            };
            if(type === 'prev') {
                setPage(prevPage => prevPage - 1);
            }
        };
        return (
            <button className={`btn-inline results__btn--${type}`} onClick={pageHandler}>
                <span>Page {type === 'prev' ? page - 1 : page + 1}</span>
                <svg className="search__icon">
                    <use href={`${Icons}#icon-triangle-${type === 'prev' ? 'left' : 'right'}`}></use>
                </svg>
            </button>      
        );
    };

    return (
        <div className="results">
            <ul className="results__list">
                { state.loading ? <LoaderUI /> : state.error ? <h4 className="results__name">Couldn't find any recipe's</h4> : renderRecipes() }
            </ul>
            <div className="results__pages">
                {
                   state.data.length > 0 && renderButtons(page, state.data.length, resPerPage)
                }
            </div>
        </div>
    );
};

export default ResultList;