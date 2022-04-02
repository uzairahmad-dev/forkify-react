import React, {useContext} from 'react';

import { RecipeContext } from '../contexts/recipe-context';
import { RecipeActionTypes } from '../utils/helper-types';
import { Icons } from '../assets/svg';

const ShoppingList: React.FC = () => {

    const { state,dispatch } = useContext(RecipeContext);

    const delBtnHandler = (id: string) => {
        const newList = [...state.shoppingList];
        const index = newList.findIndex(el => el.id === id);
        newList.splice(index,1);

        dispatch({
            type: RecipeActionTypes.SET_SHOPPING_LIST,
            payload: {
                shoppingList: newList
            }
        });
    };
    
    return (
        <div className="shopping">
            <h2 className="heading-2">My Shopping List</h2>
            <ul className="shopping__list">
                {
                    state.shoppingList.length > 0 && 
                    state.shoppingList.map(item => {
                        return (
                            <li className="shopping__item" key={item.id}>
                                <div className="shopping__count">
                                    <input type="number" defaultValue={item.count.toString()} step={item.count} className="shopping__count-value" />
                                    <p>{item.unit}</p>
                                </div>
                                <p className="shopping__description">{item.ingredient}</p>
                                <button className="shopping__delete btn-tiny" onClick={() => delBtnHandler(item.id)}>
                                    <svg>
                                        <use href={`${Icons}#icon-circle-with-cross`}></use>
                                    </svg>
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
            <div className="copyright">
                &copy; by Uzair Ahmad. Design By Jonas Schmedtmann. Powered by 
                <a href="http://food2fork.com" target="_blank" rel="noreferrer" className="link"> Food2Fork.com</a>.
            </div>
        </div>
    );
};

export default ShoppingList;