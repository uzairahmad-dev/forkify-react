import React from 'react';

import Header from './components/Header';
import ResultList from './components/ResultList';
import RecipeView from './components/RecipeView';

const App: React.FC = () => {
  return (
      <div className="container">
        <Header />
        <ResultList />
        <RecipeView />
      </div>
  );
}

export default App;
