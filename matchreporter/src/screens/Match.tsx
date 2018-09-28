import * as React from 'react';
import { IAppProps } from "../App";
import Navigator from '../components/Navigator';
import Screentitle from '../components/Screentitle';
import {Screens} from "../model/AppState";


import '../css/App.css';
import bgMatch from '../img/backgrounds/match.png';
import title from '../img/MATCH.png';

const bgStyle = {
  backgroundImage: `url(${bgMatch})`
};

class Match extends React.Component<IAppProps, {}> {
    public componentWillMount() {
        this.props.appState.screen = Screens.Match;
    }
    public render() {
        return <div className="App" style={bgStyle}>
            <Navigator appState={this.props.appState}/>
            <Screentitle src={title}/>
        </div>;
    };
}
export default Match;