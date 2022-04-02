import React from 'react';

import Header from './components/Header';
import ResultList from './components/ResultList';
import RecipeView from './components/RecipeView';
import ShoppingList from './components/ShoppingList';

const App: React.FC = () => {
  return (
      <div className="container">
        <Header />
        <ResultList />
        <RecipeView />
        <ShoppingList />
      </div>
  );
}

export default App;
