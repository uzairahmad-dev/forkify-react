import React, {createContext, useReducer} from 'react';

import { 
  Recipe,
  RecipeActionTypes,
  RecipeProviderProps,
  RecipeAction,
  RecipeSingle,
  LikedRecipe,
  IngredientObj
} from '../utils/helper-types';

type AppState = typeof initialState;

const initialState = {
    recipeFor: "",
    data: [] as Recipe[],
    error: false,
    loading: false,
    recipe: {} as RecipeSingle,
    recipe_id: "",
    likedRecipes: [] as LikedRecipe[],
    shoppingList: [] as IngredientObj[]
};

export const RecipeContext = createContext<{
    state: AppState,
    dispatch: React.Dispatch<any>
}>({state: initialState, dispatch: () => null});

const recipeReducer = (state: AppState, action: RecipeAction) => {
  switch (action.type) {
    case RecipeActionTypes.SET_RECIPE_VALUE: {
      return { ...state, recipeFor: action.payload.recipeFor };
    }
    case RecipeActionTypes.SET_RECIPES: {
      return { ...state, data: action.payload.data };
    }
    case RecipeActionTypes.SET_ERROR: {
      return { ...state, data: [], error: action.payload.error }
    }
    case RecipeActionTypes.SET_LOADING: {
      return { ...state, loading: action.payload.loading }
    }
    case RecipeActionTypes.SET_RECIPE: {
      return { ...state, recipe: action.payload.recipe }
    }
    case RecipeActionTypes.SET_RECIPE_ID: {
      return { ...state, recipe_id: action.payload.recipe_id }
    }
    case RecipeActionTypes.SET_LIKED_RECIPES: {
      return { ...state, likedRecipes: action.payload.likedRecipes }
    }
    case RecipeActionTypes.SET_SHOPPING_LIST: {
      return { ...state, shoppingList: action.payload.shoppingList }
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const RecipeProvider = ({ children }: RecipeProviderProps) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);
  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeProvider;