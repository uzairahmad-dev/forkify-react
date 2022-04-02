import uniqid from 'uniqid';
import {Fraction} from 'fractional';

import { Icons } from '../assets/svg';
import { IngredientObj } from './helper-types';

export const limitRecipeTitle = (title: string, limit=17): string => {
    const newTitle: string[] = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc,cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

export const parseIngredients = (ing: string[]) => {
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
        return objIng = {
            ...objIng,
            id: uniqid()
        };
    });

    return newIngredients;
}

export const formatCount = (count: number) => {
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

export const createIngredient = (ingredient: IngredientObj) => {
    return (
        <li className="recipe__item" key={ingredient.id}>
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

export const createNewIngredients = (ingredients: IngredientObj[], type: string, serving: number) => {
    const newIng = [...ingredients];
    const newServings = type === 'inc' ? serving + 1: serving - 1;
    newIng.forEach(ing => {
        ing.count *= ( newServings / serving);
    });
    return newIng;
};  

export const calcTime = (length: number): number => {
    //* Assuming that we need 15 min for each 3 ingredients
    const numIng = length;
    const periods = Math.ceil(numIng / 3);
    return periods * 15;
};