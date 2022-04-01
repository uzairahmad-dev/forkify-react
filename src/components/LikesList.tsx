import React, {useContext} from "react";

import {RecipeContext, RecipeActionTypes} from '../contexts/recipe-context';

interface LikesProps {
    liked: {
        id: string,
        name: string,
        img: string,
        author: string,
    };
};

const Likes: React.FC<LikesProps> = (props) => {

    const { dispatch } = useContext(RecipeContext);

    const recipeIdHandler = (e: React.SyntheticEvent) => {
        e.preventDefault();

        dispatch({
            type: RecipeActionTypes.SET_RECIPE_ID,
            payload: {
                recipe_id: props.liked.id
            }
        })
        
    };

    return (
        <li>
            <a className="likes__link" href="/" onClick={recipeIdHandler}>
                <figure className="likes__fig">
                    <img src={props.liked.img} alt="Test" />
                </figure>
                <div className="likes__data">
                    <h4 className="likes__name">{props.liked.name}</h4>
                    <p className="likes__author">{props.liked.author}</p>
                </div>
            </a>
        </li>        
    );
}   

export default Likes;