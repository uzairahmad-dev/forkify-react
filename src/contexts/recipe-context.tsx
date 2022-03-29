import React, {createContext, useReducer} from 'react';

import { Recipe } from '../utils/helper-interfaces';

interface RecipeProviderProps {
    children: React.ReactNode;
};

interface RecipeAction {
  type: RecipeActionTypes,
  payload?: any 
};

type AppState = typeof initialState;

export enum RecipeActionTypes {
  SET_RECIPE_VALUE = "SET_RECIPE_VALUE",
  SET_RECIPES = "SET_RECIPES",
  SET_ERROR= "SET_ERROR",
  SET_LOADING= "SET_LOADING"
};

const initialState = {
    recipeFor: "",
    data: [] as Recipe[],
    error: false,
    loading: false
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