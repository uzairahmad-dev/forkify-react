import React, { LegacyRef } from 'react';

import {Icons} from '../assets/svg/index'

interface FormProps {
    recipeSubmitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
    inpRecipeRef: LegacyRef<HTMLInputElement>
};

const SearchForm: React.FC<FormProps> = (props) => {
    return (
        <form className="search" onSubmit={props.recipeSubmitHandler} >
            <input ref={props.inpRecipeRef} type="text" className="search__field" placeholder="Search over 1,000,000 recipes..." required/>
            <button className="btn search__btn" type="submit">
                <svg className="search__icon">
                    <use href={`${Icons}#icon-magnifying-glass`}></use>
                </svg>
                <span>Search</span>
            </button>
        </form>
    );  
}   

export default SearchForm;