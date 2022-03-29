import React from 'react';

import Header from './components/Header';
import ResultList from './components/ResultList';

const App: React.FC = () => {
  return (
      <div className="container">
        <Header />
        <ResultList />
      </div>
  );
}

export default App;
