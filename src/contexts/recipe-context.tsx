import React, {createContext, useReducer} from 'react';

import { Recipe } from '../utils/helper-interfaces';

interface RecipeProviderProps {
    children: React.ReactNode;
};

interface RecipeAction {
  type: RecipeActionTypes,
  payload?: any 
};

type RecipeSingle = {
  publisher: string;
  ingredients: string[];
  source_url: string;
  image_url: string;
  title: string;
};

type LikedRecipe = {
  id: string,
  title: string
}

type AppState = typeof initialState;

export enum RecipeActionTypes {
  SET_RECIPE_VALUE = "SET_RECIPE_VALUE",
  SET_RECIPES = "SET_RECIPES",
  SET_ERROR= "SET_ERROR",
  SET_LOADING= "SET_LOADING",
  SET_RECIPE="SET_RECIPE",
  SET_RECIPE_ID= "SET_RECIPE_ID",
  SET_LIKED_RECIPES= "SET_LIKED_RECIPES"
};

const initialState = {
    recipeFor: "",
    data: [] as Recipe[],
    error: false,
    loading: false,
    recipe: {} as RecipeSingle,
    recipe_id: "",
    likedRecipes: [] as LikedRecipe[]
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