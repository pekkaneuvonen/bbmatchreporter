import * as React from 'react';
import Navigator from './components/Navigator';
// import ReportsList from './components/ReportsList';
import {AppState, Screens} from "./model/AppState";
import readyBtn from './img/buttons/ready.png';

import './css/App.css';
import Home from './screens/Home';
import Match from './screens/Match';
import Postmatch from './screens/Postmatch';
import Prematch from './screens/Prematch';

export interface IAppProps {
  appState: AppState;
}

const appState = new AppState();

const PrematchScreen = () => {
  console.log("PrematchScreen");
  if (appState.screen === Screens.Prematch) {
    return (
      <Prematch 
        appState={appState}
      />
    );
  }
}
const MatchScreen = () => {
  console.log("MatchScreen");
  if (appState.screen === Screens.Match) {
    return (
      <Match 
        appState={appState}
      />
    );
  }
}
const PostmatchScreen = () => {
  console.log("PostmatchScreen");
  if (appState.screen === Screens.Postmatch) {
    return (
      <Postmatch 
        appState={appState}
      />
    );
  }
}

class App extends React.Component {
  public render() {
    return (
      <div>
        <div id="header">
          <Navigator appState={appState}/>
        </div>
        {this.screen()}
        <div id="footer">
          {this.confirmButton}
        </div>
      </div>
    );
  }

  private screen() {
    switch (appState.screen) {
      case Screens.Home:
        return <Home appState={appState}/>
        break;
      case Screens.Prematch:
        return <Prematch appState={appState}/>
        break;
      case Screens.Match:
        return <Match appState={appState}/>
        break;
      case Screens.Postmatch:
        return <Postmatch appState={appState}/>
        break;
    }
  }
  private confirmButton = () => {
    return (
      <div onClick={this.confirm("none")}>
        <img className={"bottomButton"} src={readyBtn}/>
      </div>
    );
  }
  private confirm = (message: string) => {
    return () => {
        console.log("confirm this: " + message);
    };
  }
}

export default App;
