export enum RecipeActionTypes {
    SET_RECIPE_VALUE = "SET_RECIPE_VALUE",
    SET_RECIPES = "SET_RECIPES",
    SET_ERROR= "SET_ERROR",
    SET_LOADING= "SET_LOADING",
    SET_RECIPE="SET_RECIPE",
    SET_RECIPE_ID= "SET_RECIPE_ID",
    SET_LIKED_RECIPES= "SET_LIKED_RECIPES",
    SET_SHOPPING_LIST= "SET_SHOPPING_LIST"
  };

export interface Recipe {
    publisher: string;
    title: string;
    source_url: string;
    recipe_id: string;
    image_url: string;
    social_rank: number;
    publisher_url: string
};

export interface RecipeProviderProps {
    children: React.ReactNode;
};

export interface RecipeAction {
  type: RecipeActionTypes,
  payload?: any 
};

export interface IngredientObj {
    id: string,
    count: number;
    unit: string;
    ingredient: string
  };
  
  export type RecipeSingle = {
    publisher: string;
    ingredients: IngredientObj[];
    source_url: string;
    image_url: string;
    title: string;
  };

export type LikedRecipe = {
    id: string,
    title: string,
    img: string,
    author: string
}