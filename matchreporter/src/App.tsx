import * as React from 'react';
import './css/App.css';

// import logo from './logo.svg';
import frontpage from './img/frontpage.png';


class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <img src={frontpage} alt="frontpage" />
      </div>
    );
  }
}

export default App;
